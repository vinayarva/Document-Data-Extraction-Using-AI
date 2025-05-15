import React from 'react';

function FileUploadPanelHeader() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-blue-700">PDF Inspector</h1>
      <p className="text-gray-600 mb-8">
        Upload PDF files (up to 10) to view their metadata and content as JSON.
      </p>
    </>
  );
}
export default FileUploadPanelHeader;