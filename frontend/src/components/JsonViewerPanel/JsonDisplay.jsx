import React from 'react';
import { VIEW_MODES } from '../../constants'; // Assuming path is correct

function JsonDisplay({ jsonData, viewMode }) {
  if (jsonData === null || jsonData === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-center p-4">
          Select a file to view its data, or upload new files.
        </p>
      </div>
    );
  }

  // JSON View (handles both objects and arrays correctly)
  if (viewMode === VIEW_MODES.JSON) {
    return (
      <pre className="whitespace-pre-wrap text-sm bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
        {JSON.stringify(jsonData, null, 2)}
      </pre>
    );
  }

  // Table View
  if (viewMode === VIEW_MODES.TABLE) {
    if (Array.isArray(jsonData)) {
      // Handle array of objects (e.g., line_items if passed directly)
      if (jsonData.length === 0) {
        return <p className="text-gray-500 text-center p-4">The data array is empty.</p>;
      }
      // Ensure all items are objects for header generation, or handle mixed types
      const firstItem = jsonData[0];
      const headers = typeof firstItem === 'object' && firstItem !== null ? Object.keys(firstItem) : [];
      
      if (headers.length === 0 && jsonData.length > 0) {
         // Array of non-objects or empty objects
         return (
            <div>
                <p className="text-gray-600 text-sm mb-2">Data is an array of simple values or empty objects. Displaying as a list:</p>
                <ul className="list-disc pl-5 text-sm">
                    {jsonData.map((item, index) => (
                        <li key={index} className="py-1">{JSON.stringify(item)}</li>
                    ))}
                </ul>
            </div>
        );
      }

      return (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="p-3 text-left font-semibold text-gray-600 border-b border-r border-gray-300 capitalize">
                    {header.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jsonData.map((rowItem, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                  {headers.map((header) => (
                    <td key={`${rowIndex}-${header}`} className="p-3 text-gray-700 border-r border-gray-300 last:border-r-0 break-words">
                      {typeof rowItem[header] === 'object' && rowItem[header] !== null
                        ? JSON.stringify(rowItem[header]) // Stringify nested objects/arrays in cells
                        : String(rowItem[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      // Handle a single object (e.g., the main processedData object)
      const entries = Object.entries(jsonData);
      if (entries.length === 0) {
        return <p className="text-gray-500 text-center p-4">The data object is empty.</p>;
      }
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-600 border-b border-r border-gray-300 w-1/3">Key</th>
                <th className="p-3 text-left font-semibold text-gray-600 border-b border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={key} className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-3 font-medium text-gray-700 bg-gray-50 border-r border-gray-300 break-words">
                    {/* Format key for readability */}
                    {key.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td className="p-3 text-gray-700 break-words">
                    {/* If value is an array (like line_items), recursively call JsonDisplay or handle specifically */}
                    {Array.isArray(value)
                      ? <JsonDisplay jsonData={value} viewMode={VIEW_MODES.TABLE} /> // Recursively display nested tables for arrays
                      : (typeof value === 'object' && value !== null
                        ? JSON.stringify(value, null, 2) // Display nested objects as JSON string
                        : String(value))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Fallback for other data types (e.g., string, number) if jsonData is not object/array
      return <p className="text-orange-600 bg-orange-100 p-3 rounded-md text-center">Data is not in a recognized object/array format for table view.</p>;
    }
  }

  // Fallback for unknown view mode
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <p className="text-orange-600 bg-orange-100 p-3 rounded-md text-center mb-4">
        Cannot display data in the current view.
      </p>
      <pre className="w-full whitespace-pre-wrap text-sm bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
        {JSON.stringify(jsonData, null, 2)}
      </pre>
    </div>
  );
}
export default JsonDisplay;