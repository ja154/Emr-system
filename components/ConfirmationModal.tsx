import React from 'react';
import Modal from './Modal';
import { AlertTriangleIcon } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
}) => {
  const confirmButtonClasses = {
    danger: 'bg-brand-danger-600 hover:bg-brand-danger-700 focus:ring-brand-danger-500',
    primary: 'bg-brand-primary-600 hover:bg-brand-primary-700 focus:ring-brand-primary-500',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div>
        <div className="sm:flex sm:items-start">
            {variant === 'danger' && (
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-brand-danger-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangleIcon className="h-6 w-6 text-brand-danger-600" aria-hidden="true" />
            </div>
            )}
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <p className="text-sm text-brand-gray-600">{message}</p>
            </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmButtonClasses[variant]}`}
            onClick={() => {
                onConfirm();
            }}
            >
            {confirmText}
            </button>
            <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-brand-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
            >
            {cancelText}
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;