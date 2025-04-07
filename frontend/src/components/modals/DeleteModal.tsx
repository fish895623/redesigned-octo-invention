import React, { ReactNode } from 'react';

interface DeleteModalProps {
  name: string;
  title?: string;
  onClose?: () => void;
  children?: ReactNode;
  isLoading?: boolean;
}

/**
 * @summary This is a modal component for confirming deletion operations.
 * @description It is used to delete entities from the database.
 * @description It provides a consistent layout and styling for delete confirmation dialogs.
 */
export default class DeleteModal extends React.Component<DeleteModalProps> {
  static defaultProps = {
    title: undefined,
    onClose: () => {},
    isLoading: false,
  };

  render() {
    const { name, title, onClose, children, isLoading } = this.props;
    const modalTitle = title || `Delete ${name}`;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div
          className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">{modalTitle}</h2>
            <button
              className="text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
              onClick={onClose}
              aria-label="Close modal"
              disabled={isLoading}
            >
              &times;
            </button>
          </div>

          <div className="px-6 py-4">
            {children || (
              <div className="mb-4 text-red-500 text-center">
                <p className="font-semibold">Warning: This action cannot be undone</p>
                <p className="mt-2 text-gray-300">This will permanently delete the {name.toLowerCase()}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
