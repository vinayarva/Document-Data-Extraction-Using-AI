import React from 'react';

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
      <p className="font-semibold">Error:</p>
      <p>{message}</p>
    </div>
  );
}
export default ErrorMessage;