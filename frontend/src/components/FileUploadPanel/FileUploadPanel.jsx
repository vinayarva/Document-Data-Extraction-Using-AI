import React from 'react';
import FileUploadPanelHeader from './FileUploadPanelHeader';
import FileInput from '../ui/FileInput';
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorMessage from '../ui/ErrorMessage';
import FileListDisplay from './FileListDisplay';

function FileUploadPanel({
  onFileSelect,
  processedFiles,
  selectedFileId,
  onSelectFileFromList,
  isUploading, // Global loading state for the whole upload process
  uploadError,  // Global error for the upload process
  customPrompt,
  onCustomPromptChange,
}) {
  return (
    <div className="w-full md:w-[40%] lg:w-[35%] md:h-screen flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-300 p-6 md:p-8 bg-white flex-shrink-0">
      <div className="w-full max-w-md text-center">
        <FileUploadPanelHeader />
        <FileInput onChange={onFileSelect} disabled={isUploading} multiple={true} />

        {/* Custom Prompt Textarea */}
        <div className="mt-4 w-full">
          <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 text-left mb-1">
            Custom Prompt (Optional):
          </label>
          <textarea
            id="customPrompt"
            rows="3"
            value={customPrompt}
            onChange={onCustomPromptChange}
            disabled={isUploading}
            placeholder="Enter a custom prompt, or leave blank for default..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-60"
          />
        </div>

        {isUploading && <LoadingIndicator text="Processing files..." />}
        <ErrorMessage message={uploadError} /> {/* For global upload errors */}
        
        <FileListDisplay
          files={processedFiles}
          selectedFileId={selectedFileId}
          onSelectFile={onSelectFileFromList}
        />
      </div>
    </div>
  );
}
export default FileUploadPanel;