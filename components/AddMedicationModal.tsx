import React, { useState, useEffect } from 'react';
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Medication name is required.";
    if (!formData.dosage.trim()) newErrors.dosage = "Dosage is required.";
    if (!formData.frequency.trim()) newErrors.frequency = "Frequency is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddMedication(formData);
      onClose();
    }
  };

  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  const errorInputClass = "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Medication">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Medication Name</label>
          <input type="text" name="name" id="name" required className={`${baseInputClass} ${errors.name ? errorInputClass : ''}`} onChange={handleChange} value={formData.name} placeholder="e.g., Metformin" aria-invalid={!!errors.name} aria-describedby="med-name-error"/>
          {errors.name && <p id="med-name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-brand-gray-700">Dosage</label>
            <input type="text" name="dosage" id="dosage" required className={`${baseInputClass} ${errors.dosage ? errorInputClass : ''}`} onChange={handleChange} value={formData.dosage} placeholder="e.g., 500mg" aria-invalid={!!errors.dosage} aria-describedby="dosage-error"/>
            {errors.dosage && <p id="dosage-error" className="mt-1 text-sm text-red-600">{errors.dosage}</p>}
        </div>
        
        <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-brand-gray-700">Frequency</label>
            <input type="text" name="frequency" id="frequency" required className={`${baseInputClass} ${errors.frequency ? errorInputClass : ''}`} onChange={handleChange} value={formData.frequency} placeholder="e.g., Twice daily" aria-invalid={!!errors.frequency} aria-describedby="frequency-error"/>
            {errors.frequency && <p id="frequency-error" className="mt-1 text-sm text-red-600">{errors.frequency}</p>}
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