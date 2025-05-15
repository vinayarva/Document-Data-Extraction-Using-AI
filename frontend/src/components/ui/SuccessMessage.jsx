import React from 'react';

function SuccessMessage({ message }) {
    if (!message) return null;
    return (
        // Ensure this component is styled appropriately if used globally (e.g., with absolute positioning in App.jsx)
        // For now, basic styling suitable for inline use.
        <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
            {message}
        </div>
    );
}
export default SuccessMessage;