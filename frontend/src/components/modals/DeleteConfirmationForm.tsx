import React, { ChangeEvent, FormEvent } from 'react';

interface DeleteConfirmationFormProps {
  entityName: string;
  entityTitle: string;
  warningText: string;
  confirmText: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
  actionButtonText?: string;
  loadingButtonText?: string;
}

/**
 * A reusable form component for delete confirmation
 * Requires the user to type the exact entity name to confirm deletion
 */
const DeleteConfirmationForm: React.FC<DeleteConfirmationFormProps> = ({
  entityName,
  entityTitle,
  warningText,
  confirmText,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
  error,
  actionButtonText = 'Delete',
  loadingButtonText = 'Deleting...',
}) => {
  const isValid = confirmText === entityTitle;

  return (
    <>
      <div className="mb-4 text-red-500 text-center">
        <p className="font-semibold">Warning: This action cannot be undone</p>
        <p className="mt-2 text-gray-300">{warningText}</p>
      </div>

      <form onSubmit={onSubmit} className="mt-4">
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2 text-center">
            To confirm deletion, please type the {entityName.toLowerCase()} name:{' '}
            <span className="font-semibold">{entityTitle}</span>
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={onChange}
            placeholder={`Type ${entityName.toLowerCase()} name to confirm`}
            autoFocus
            className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`px-4 py-2 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
              isLoading || !isValid ? 'bg-red-800 cursor-not-allowed opacity-70' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? loadingButtonText : actionButtonText}
          </button>
        </div>
      </form>
    </>
  );
};

export default DeleteConfirmationForm;
