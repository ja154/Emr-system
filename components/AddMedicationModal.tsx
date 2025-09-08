import React, { useState } from 'react';
import type { Medication } from '../types';
import Modal from './Modal';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedication: (medication: Omit<Medication, 'id'>) => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ isOpen, onClose, onAddMedication }) => {
  const initialFormData = {
    name: '',
    dosage: '',
    frequency: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMedication(formData);
    setFormData(initialFormData);
    onClose();
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Medication">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Medication Name</label>
          <input type="text" name="name" id="name" required className={inputClass} onChange={handleChange} value={formData.name} placeholder="e.g., Metformin" />
        </div>
        
        <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-brand-gray-700">Dosage</label>
            <input type="text" name="dosage" id="dosage" required className={inputClass} onChange={handleChange} value={formData.dosage} placeholder="e.g., 500mg" />
        </div>
        
        <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-brand-gray-700">Frequency</label>
            <input type="text" name="frequency" id="frequency" required className={inputClass} onChange={handleChange} value={formData.frequency} placeholder="e.g., Twice daily" />
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-blue border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Add Medication
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMedicationModal;
