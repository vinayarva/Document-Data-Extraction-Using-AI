import React from 'react';

function ViewModeButton({ currentViewMode, mode, setViewMode, children }) {
  return (
    <button
      onClick={() => setViewMode(mode)}
      className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${
        currentViewMode === mode
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

export default ViewModeButton;