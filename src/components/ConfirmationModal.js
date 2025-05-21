// components/ConfirmationModal.js
import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    
    <div className="flex flex-col items-center p-4 bg-white rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
      <p className="mb-4">Are you sure you want to delete this conference?</p>
      <div className="flex space-x-4">
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
