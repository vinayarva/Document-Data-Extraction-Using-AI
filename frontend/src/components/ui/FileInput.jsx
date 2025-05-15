import React from 'react';

function FileInput({ onChange, disabled, multiple }) {
    return (
        <label className="block w-full cursor-pointer">
            <span className="sr-only">Choose PDF file(s)</span>
            <input
                type="file"
                accept="application/pdf"
                onChange={onChange}
                disabled={disabled}
                multiple={multiple} // Enables multiple file selection
                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-3 file:px-5
                           file:rounded-lg file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           disabled:opacity-60 disabled:cursor-not-allowed"
            />
        </label>
    );
}
export default FileInput;