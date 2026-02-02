import React from "react";

const ConfirmFaceModal = ({ user, onConfirm, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Register Face
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          You are about to register face for
          <span className="font-medium"> {user.name}</span>.
          <br />
          <br />
          Make sure the user is standing in front of the camera.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmFaceModal;
