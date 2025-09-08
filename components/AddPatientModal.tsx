import React, { useState } from 'react';
import type { Patient } from '../types';
import Modal from './Modal';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Omit<Patient, 'id'>) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAddPatient }) => {
  const initialFormData = {
    name: '',
    dateOfBirth: '',
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    nationalId: '',
    nhifNumber: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPatient({
      ...formData,
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
      alerts: [],
      // FIX: The vitals property should be an empty array for a new patient to match the Vitals[] type.
      vitals: [],
      labs: [],
      medications: [],
      notes: [],
    });
    setFormData(initialFormData); // Reset form after submission
    onClose();
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Patient">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Full Name</label>
          <input type="text" name="name" id="name" required className={inputClass} onChange={handleChange} value={formData.name} placeholder="Amina Wanjala" />
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-brand-gray-700">Date of Birth</label>
          <input type="date" name="dateOfBirth" id="dateOfBirth" required className={inputClass} onChange={handleChange} value={formData.dateOfBirth} />
        </div>

        <div>
            <label htmlFor="gender" className="block text-sm font-medium text-brand-gray-700">Gender</label>
            <select name="gender" id="gender" required className={inputClass} onChange={handleChange} value={formData.gender}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
            </select>
        </div>

        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium text-brand-gray-700">National ID</label>
          <input type="text" name="nationalId" id="nationalId" required className={inputClass} onChange={handleChange} value={formData.nationalId} placeholder="12345678" />
        </div>

        <div>
          <label htmlFor="nhifNumber" className="block text-sm font-medium text-brand-gray-700">NHIF Number</label>
          <input type="text" name="nhifNumber" id="nhifNumber" required className={inputClass} onChange={handleChange} value={formData.nhifNumber} placeholder="NHIF-987654" />
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-blue border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Add Patient
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPatientModal;