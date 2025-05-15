import React, { useState, useCallback, useEffect } from 'react';
import FileUploadPanel from './components/FileUploadPanel/FileUploadPanel';
import JsonViewerPanel from './components/JsonViewerPanel/JsonViewerPanel';
import { VIEW_MODES } from './constants';
import SuccessMessage from './components/ui/SuccessMessage'; // Path relative to App.jsx

const generateUniqueId = () => `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const MAX_FILES = 10;

// Helper function to parse the processedData string that might be wrapped in ```json ... ```
const parseProcessedData = (dataString) => {
  if (typeof dataString !== 'string') {
    // If it's already an object (e.g., if backend changes to send parsed JSON directly), return it
    return dataString;
  }
  const match = dataString.match(/^```json\s*([\s\S]*?)\s*```$/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse JSON from ```json ... ``` wrapper:", e, "Raw data:", match[1]);
      return { parsingError: "Failed to parse processed JSON data from wrapper", rawData: dataString };
    }
  }
  // If no wrapper, try to parse as plain JSON.
  // This handles cases where backend might send plain JSON string or an error string.
  try {
    return JSON.parse(dataString);
  } catch (e) {
    // Not JSON and not wrapped. Could be a plain string (e.g. an error message from an older API version)
    // Or it could be an intended non-JSON string. For this app, we expect JSON.
    console.warn("processedData is not a JSON string and not wrapped:", dataString);
    // Return it as is if it's not parsable, the JsonDisplay component can then show it as a simple string if needed.
    // Or, more strictly:
    return { parsingError: "Processed data is not in expected JSON format", rawData: dataString };
  }
};


function App() {
  const [processedFilesData, setProcessedFilesData] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.JSON);
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);
  const [uploadErrorGlobal, setUploadErrorGlobal] = useState(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const handleCustomPromptChange = (e) => {
    setCustomPrompt(e.target.value);
  };

  const handleFileUpload = useCallback(async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (e.target) e.target.value = null;

    if (selectedFiles.length === 0) return;

    if (selectedFiles.length > MAX_FILES) {
      setUploadErrorGlobal(`You can upload a maximum of ${MAX_FILES} files at a time.`);
      setUploadSuccessMessage("");
      return;
    }

    setIsUploadingGlobal(true);
    setUploadErrorGlobal(null);
    setUploadSuccessMessage("");

    const currentBatchFileEntries = selectedFiles.map(file => ({
      id: generateUniqueId(),
      fileName: file.name,
      jsonData: null,
      promptText: customPrompt.trim() || null, // Store the prompt used for this batch
      error: null,
      isLoading: true,
    }));

    setProcessedFilesData(prevFiles => {
      // Filter out any files from the current batch that might already exist from a previous identical upload attempt
      // This prevents duplicate entries if user re-selects same files without page refresh.
      const prevFileNamesInCurrentBatch = new Set(currentBatchFileEntries.map(f => f.fileName));
      const filteredPrevFiles = prevFiles.filter(pf => !prevFileNamesInCurrentBatch.has(pf.fileName) || !pf.isLoading);
      return [...filteredPrevFiles, ...currentBatchFileEntries].slice(-MAX_FILES * 3); // Keep a slightly larger buffer
    });


    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append("files", file); // Backend expects "files" key
    });

    if (customPrompt.trim() !== "") {
      formData.append("prompt", customPrompt.trim());
    }

    try {
      const response = await fetch("http://ec2-13-53-174-9.eu-north-1.compute.amazonaws.com:3000/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Initial request failed: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseErr) { /* Ignore if error response is not JSON */ }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("Response body is null, cannot read SSE stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = "";

      const processSseLine = (line) => {
        if (line.startsWith("data:")) {
          const jsonDataString = line.substring(5).trim();
          if (jsonDataString) {
            try {
              const eventData = JSON.parse(jsonDataString);

              if (eventData.message === "Processing complete") {
                setUploadSuccessMessage("All files processed successfully.");
                setIsUploadingGlobal(false);
                setProcessedFilesData(prev => prev.map(pf =>
                    currentBatchFileEntries.some(cbf => cbf.fileName === pf.fileName && pf.isLoading) ? {...pf, isLoading: false} : pf
                ));
                return; // End processing for this stream
              }

              setProcessedFilesData(prev =>
                prev.map(pf => {
                  // Match by fileName. Ensure we only update files from the current batch.
                  const isFileInCurrentBatch = currentBatchFileEntries.some(cbf => cbf.fileName === pf.fileName && cbf.fileName === eventData.fileName);
                  if (isFileInCurrentBatch) {
                    const parsedJsonData = eventData.processedData ? parseProcessedData(eventData.processedData) : null;
                    const isDataError = parsedJsonData && (parsedJsonData.parsingError || parsedJsonData.error); // Check for our parsing error or backend error within data

                    // Auto-select the first successfully processed file of the current batch
                    if (!selectedFileId && parsedJsonData && !isDataError && !eventData.error) {
                      setSelectedFileId(pf.id);
                    }
                    return {
                      ...pf,
                      jsonData: isDataError ? null : parsedJsonData,
                      promptText: eventData.prompt || pf.promptText, // Use prompt from event, or what was initially set for the batch
                      error: eventData.error || (isDataError ? (parsedJsonData.parsingError || parsedJsonData.error) : null),
                      isLoading: false,
                    };
                  }
                  return pf;
                })
              );
            } catch (parseErr) {
              console.error("Failed to parse SSE data JSON:", parseErr, "Data:", jsonDataString);
              // Update the specific file with a parsing error if possible
              setProcessedFilesData(prev => prev.map(pf => {
                // Heuristic: if a file is loading and its name appears in the problematic data string
                if (pf.isLoading && jsonDataString.includes(pf.fileName)) {
                  return {...pf, error: "Failed to parse server event.", isLoading: false };
                }
                return pf;
              }));
            }
          }
        }
      };

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsUploadingGlobal(false);
          if (!uploadSuccessMessage && !uploadErrorGlobal) { // Avoid overwriting specific error/success
             setUploadSuccessMessage("File stream ended.");
          }
          break;
        }
        sseBuffer += decoder.decode(value, { stream: true });
        let EOL_index;
        while ((EOL_index = sseBuffer.indexOf("\n\n")) >= 0) { // SSE standard uses \n\n
            const lines = sseBuffer.substring(0, EOL_index).split("\n");
            lines.forEach(line => processSseLine(line.trim()));
            sseBuffer = sseBuffer.substring(EOL_index + 2);
        }
      }

    } catch (err) {
      console.error("File upload/SSE processing error:", err);
      setUploadErrorGlobal(err.message || "An error occurred during file processing.");
      setIsUploadingGlobal(false);
      setProcessedFilesData(prev =>
        prev.map(pf =>
          currentBatchFileEntries.some(cbf => cbf.fileName === pf.fileName) // Mark only current batch files as errored
            ? { ...pf, error: err.message || "Processing failed.", isLoading: false }
            : pf
        )
      );
    }
  }, [customPrompt, selectedFileId]); // Dependencies for useCallback

  const handleSelectFileFromList = useCallback((fileId) => {
    setSelectedFileId(fileId);
    // Optionally clear global messages when a new file is selected for viewing
    // setUploadErrorGlobal(null);
    // setUploadSuccessMessage("");
  }, []);

  const currentSelectedFile = processedFilesData.find(f => f.id === selectedFileId);
  const selectedFileData = currentSelectedFile?.jsonData || null;
  const selectedFileName = currentSelectedFile?.fileName || "";
  const selectedFilePromptText = currentSelectedFile?.promptText || "";

   useEffect(() => {
    if (uploadSuccessMessage) {
      const timer = setTimeout(() => setUploadSuccessMessage(""), 5000); // Auto-hide after 5s
      return () => clearTimeout(timer);
    }
  }, [uploadSuccessMessage]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-sans antialiased">
      <FileUploadPanel
        onFileSelect={handleFileUpload}
        processedFiles={processedFilesData}
        selectedFileId={selectedFileId}
        onSelectFileFromList={handleSelectFileFromList}
        isUploading={isUploadingGlobal}
        uploadError={uploadErrorGlobal}
        customPrompt={customPrompt}
        onCustomPromptChange={handleCustomPromptChange}
      />
      {/* Global Success Message Display (positioned) */}
      {uploadSuccessMessage && (
         <div className="fixed top-4 right-4 z-50 p-2 bg-green-100 border border-green-300 text-green-700 rounded-md shadow-lg">
            <p>{uploadSuccessMessage}</p>
         </div>
      )}
      <JsonViewerPanel
        jsonData={selectedFileData}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        selectedFileName={selectedFileName}
        selectedFilePrompt={selectedFilePromptText}
      />
    </div>
  );
}
export default App;
