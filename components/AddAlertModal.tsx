import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface AddAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAlert: (alert: string) => void;
}

const AddAlertModal: React.FC<AddAlertModalProps> = ({ isOpen, onClose, onAddAlert }) => {
  const [alertText, setAlertText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAlertText('');
      setError(null);
    }
  }, [isOpen]);

  const validate = (): boolean => {
    if (!alertText.trim()) {
      setError("Alert cannot be empty.");
      return false;
    }
     if (alertText.length > 50) {
      setError("Alert should not exceed 50 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddAlert(alertText.trim());
      onClose();
    }
  };
  
  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-primary-500 focus:border-brand-primary-500 sm:text-sm";
  const errorInputClass = "border-brand-danger-500 text-brand-danger-900 placeholder-brand-danger-300 focus:ring-brand-danger-500 focus:border-brand-danger-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Patient Alert">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="alertText" className="block text-sm font-medium text-brand-gray-700">Alert Description</label>
          <input 
            type="text" 
            name="alertText" 
            id="alertText" 
            required 
            className={`${baseInputClass} ${error ? errorInputClass : ''}`} 
            onChange={(e) => setAlertText(e.target.value)} 
            value={alertText} 
            placeholder="e.g., Penicillin Allergy, Fall Risk"
            aria-invalid={!!error}
            aria-describedby="alert-error"
          />
          {error && <p id="alert-error" className="mt-1 text-sm text-brand-danger-600">{error}</p>}
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
            Add Alert
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAlertModal;