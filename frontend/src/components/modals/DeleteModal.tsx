import React from 'react';

interface DeleteModalProps {
  name: string;
}

/**
 * @summary This is a modal component for confirming deletion operations.
 * @description It is used to delete from the database.
 * @description It is used to type the project name to confirm the deletion.
 */
export default class DeleteModal extends React.Component<DeleteModalProps> {
  render() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Delete {this.props.name}</h2>
            <button
              className="text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="mb-4 text-red-500"></div>
          </div>
        </div>
      </div>
    );
  }
}
