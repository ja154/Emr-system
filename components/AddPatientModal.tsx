import React, { useState, useEffect } from 'react';
import type { Patient } from '../types';
import Modal from './Modal';
import DatePicker from './DatePicker';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    
    if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required.";
    } else if (new Date(formData.dateOfBirth) >= new Date()) {
        newErrors.dateOfBirth = "Date of birth must be in the past.";
    }
    
    if (!formData.nationalId.trim()) {
        newErrors.nationalId = "National ID is required.";
    } else if (!/^\d+$/.test(formData.nationalId)) {
        newErrors.nationalId = "National ID must contain only numbers.";
    }

    if (!formData.nhifNumber.trim()) newErrors.nhifNumber = "NHIF Number is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, dateOfBirth: date }));
    if (errors.dateOfBirth) {
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddPatient({
        ...formData,
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
        alerts: [],
        vitals: [],
        labs: [],
        medications: [],
        notes: [],
        timeline: [],
        reminders: []
      });
      onClose();
    }
  };

  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-primary-500 focus:border-brand-primary-500 sm:text-sm";
  const errorInputClass = "border-brand-danger-500 text-brand-danger-900 placeholder-brand-danger-300 focus:ring-brand-danger-500 focus:border-brand-danger-500";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Patient">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Full Name</label>
          <input type="text" name="name" id="name" required className={`${baseInputClass} ${errors.name ? errorInputClass : ''}`} onChange={handleChange} value={formData.name} placeholder="Amina Wanjala" aria-invalid={!!errors.name} aria-describedby="name-error" />
          {errors.name && <p id="name-error" className="mt-1 text-sm text-brand-danger-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-brand-gray-700">Date of Birth</label>
          <DatePicker
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleDateChange}
            inputClassName={`${baseInputClass} ${errors.dateOfBirth ? errorInputClass : ''}`}
            aria-invalid={!!errors.dateOfBirth}
            aria-describedby="dob-error"
          />
           {errors.dateOfBirth && <p id="dob-error" className="mt-1 text-sm text-brand-danger-600">{errors.dateOfBirth}</p>}
        </div>

        <div>
            <label htmlFor="gender" className="block text-sm font-medium text-brand-gray-700">Gender</label>
            <select name="gender" id="gender" required className={baseInputClass} onChange={handleChange} value={formData.gender}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
            </select>
        </div>

        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium text-brand-gray-700">National ID</label>
          <input type="text" name="nationalId" id="nationalId" required className={`${baseInputClass} ${errors.nationalId ? errorInputClass : ''}`} onChange={handleChange} value={formData.nationalId} placeholder="12345678" aria-invalid={!!errors.nationalId} aria-describedby="nationalId-error" />
           {errors.nationalId && <p id="nationalId-error" className="mt-1 text-sm text-brand-danger-600">{errors.nationalId}</p>}
        </div>

        <div>
          <label htmlFor="nhifNumber" className="block text-sm font-medium text-brand-gray-700">NHIF Number</label>
          <input type="text" name="nhifNumber" id="nhifNumber" required className={`${baseInputClass} ${errors.nhifNumber ? errorInputClass : ''}`} onChange={handleChange} value={formData.nhifNumber} placeholder="NHIF-987654" aria-invalid={!!errors.nhifNumber} aria-describedby="nhif-error"/>
           {errors.nhifNumber && <p id="nhif-error" className="mt-1 text-sm text-brand-danger-600">{errors.nhifNumber}</p>}
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
            Add Patient
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPatientModal;