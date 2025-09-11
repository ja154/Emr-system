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
  
  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  const errorInputClass = "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";

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
          {error && <p id="alert-error" className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-blue border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Add Alert
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAlertModal;
