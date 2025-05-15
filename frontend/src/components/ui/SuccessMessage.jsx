import React from 'react';

function SuccessMessage({ message }) {
    if (!message) return null;
    return (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
            {message}
        </div>
    );
}
export default SuccessMessage;