import React from 'react';
import JsonViewerHeader from './JsonViewerHeader';
import JsonDisplay from './JsonDisplay';

function JsonViewerPanel({ jsonData, viewMode, onSetViewMode, selectedFileName, selectedFilePrompt }) {
  return (
    <div className="w-full md:w-[60%] lg:w-[65%] md:h-screen flex flex-col p-6 md:p-8 overflow-hidden">
      <JsonViewerHeader currentViewMode={viewMode} onSetViewMode={onSetViewMode} />
       {selectedFileName && (
        <p className="mb-1 text-sm text-gray-600">
          Showing data for: <span className="font-semibold">{selectedFileName}</span>
        </p>
      )}

      {/* Display Prompt */}
      {selectedFilePrompt && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
          <h4 className="text-sm font-semibold text-indigo-700 mb-1">Prompt Used:</h4>
          <pre className="whitespace-pre-wrap text-xs text-indigo-800 bg-transparent p-0 m-0">
            {selectedFilePrompt}
          </pre>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-white border border-gray-300 p-4 rounded-lg shadow-sm">
        <JsonDisplay jsonData={jsonData} viewMode={viewMode} />
      </div>
      <footer className="mt-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} PDF Inspector. For demonstration purposes.</p>
      </footer>
    </div>
  );
}
export default JsonViewerPanel;