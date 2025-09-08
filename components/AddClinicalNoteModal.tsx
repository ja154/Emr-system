import React, { useState, useEffect } from 'react';
import type { ClinicalNote } from '../types';
import Modal from './Modal';

interface AddClinicalNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClinicalNote: (note: Omit<ClinicalNote, 'id' | 'date' | 'author'>) => void;
}

const AddClinicalNoteModal: React.FC<AddClinicalNoteModalProps> = ({ isOpen, onClose, onAddClinicalNote }) => {
  const initialFormData = {
    specialty: '',
    contentSnippet: '',
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
    if (!formData.specialty.trim()) newErrors.specialty = "Specialty is required.";
    if (!formData.contentSnippet.trim()) newErrors.contentSnippet = "Note content cannot be empty.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddClinicalNote(formData);
      onClose();
    }
  };

  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  const errorInputClass = "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Clinical Note">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="specialty" className="block text-sm font-medium text-brand-gray-700">Specialty</label>
          <input type="text" name="specialty" id="specialty" required className={`${baseInputClass} ${errors.specialty ? errorInputClass : ''}`} onChange={handleChange} value={formData.specialty} placeholder="e.g., Cardiology" aria-invalid={!!errors.specialty} aria-describedby="specialty-error"/>
           {errors.specialty && <p id="specialty-error" className="mt-1 text-sm text-red-600">{errors.specialty}</p>}
        </div>
        
        <div>
            <label htmlFor="contentSnippet" className="block text-sm font-medium text-brand-gray-700">Note</label>
            <textarea 
                name="contentSnippet" 
                id="contentSnippet" 
                required 
                rows={5}
                className={`${baseInputClass} ${errors.contentSnippet ? errorInputClass : ''}`} 
                onChange={handleChange} 
                value={formData.contentSnippet} 
                placeholder="Enter clinical note here..."
                aria-invalid={!!errors.contentSnippet} 
                aria-describedby="content-error"
            />
            {errors.contentSnippet && <p id="content-error" className="mt-1 text-sm text-red-600">{errors.contentSnippet}</p>}
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-blue border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Add Note
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClinicalNoteModal;