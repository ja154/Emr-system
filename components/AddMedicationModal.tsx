import React, { useState, useEffect } from 'react';
import type { Medication } from '../types';
import Modal from './Modal';
import { AlertTriangleIcon } from './icons';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedication: (medication: Omit<Medication, 'id'>) => void;
  patientAlerts: string[];
}

const ALLERGY_MAP: { [key: string]: string[] } = {
  'penicillin': ['penicillin', 'amoxicillin', 'ampicillin', 'augmentin', 'amoxil'],
  'sulfa': ['sulfamethoxazole', 'bactrim', 'septra', 'sulfasalazine'],
  'nsaid': ['ibuprofen', 'naproxen', 'aspirin', 'diclofenac', 'ketorolac', 'celecoxib'],
  'codeine': ['codeine', 'tylenol #3'],
};

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ isOpen, onClose, onAddMedication, patientAlerts }) => {
  const initialFormData = {
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [allergyWarning, setAllergyWarning] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setAllergyWarning(null);
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Medication name is required.";
    if (!formData.dosage.trim()) newErrors.dosage = "Dosage is required.";
    if (!formData.frequency.trim()) newErrors.frequency = "Frequency is required.";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const checkForAllergy = (medicationName: string): string | null => {
    const medLower = medicationName.toLowerCase().trim();
    if (!medLower || !patientAlerts) return null;

    for (const alert of patientAlerts) {
        const alertLower = alert.toLowerCase();
        for (const allergyKey in ALLERGY_MAP) {
            if (alertLower.includes(allergyKey)) {
                const drugList = ALLERGY_MAP[allergyKey];
                if (drugList.some(drug => medLower.includes(drug))) {
                    return alert; 
                }
            }
        }
        const alertDrug = alertLower.replace(' allergy','').trim();
         if (medLower.includes(alertDrug)) {
             return alert;
         }
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClose = () => {
    setAllergyWarning(null);
    onClose();
  };

  const handleForcePrescribe = () => {
    if(validate()){
        onAddMedication(formData);
        handleClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const detectedAllergy = checkForAllergy(formData.name);
      if (detectedAllergy) {
        setAllergyWarning(detectedAllergy);
      } else {
        onAddMedication(formData);
        handleClose();
      }
    }
  };

  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-primary-500 focus:border-brand-primary-500 sm:text-sm disabled:bg-brand-gray-100";
  const errorInputClass = "border-brand-danger-500 text-brand-danger-900 placeholder-brand-danger-300 focus:ring-brand-danger-500 focus:border-brand-danger-500";
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Medication">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {allergyWarning ? (
            <div className="p-4 bg-brand-warning-50 border-l-4 border-brand-warning-400 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangleIcon className="h-6 w-6 text-brand-warning-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-bold text-brand-warning-800">Potential Allergy Detected</p>
                        <p className="mt-1 text-sm text-brand-warning-700">
                            Patient has a recorded alert for: <span className="font-semibold">{allergyWarning}</span>.
                        </p>
                        <p className="mt-2 text-sm text-brand-warning-700">
                            Please verify before proceeding.
                        </p>
                    </div>
                </div>
            </div>
        ) : null}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Medication Name</label>
          <input type="text" name="name" id="name" required className={`${baseInputClass} ${errors.name ? errorInputClass : ''}`} onChange={handleChange} value={formData.name} placeholder="e.g., Amoxicillin" aria-invalid={!!errors.name} aria-describedby="med-name-error" disabled={!!allergyWarning}/>
          {errors.name && <p id="med-name-error" className="mt-1 text-sm text-brand-danger-600">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-brand-gray-700">Dosage</label>
                <input type="text" name="dosage" id="dosage" required className={`${baseInputClass} ${errors.dosage ? errorInputClass : ''}`} onChange={handleChange} value={formData.dosage} placeholder="e.g., 500mg" aria-invalid={!!errors.dosage} aria-describedby="dosage-error" disabled={!!allergyWarning}/>
                {errors.dosage && <p id="dosage-error" className="mt-1 text-sm text-brand-danger-600">{errors.dosage}</p>}
            </div>
            <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-brand-gray-700">Frequency</label>
                <input type="text" name="frequency" id="frequency" required className={`${baseInputClass} ${errors.frequency ? errorInputClass : ''}`} onChange={handleChange} value={formData.frequency} placeholder="e.g., Twice daily" aria-invalid={!!errors.frequency} aria-describedby="frequency-error" disabled={!!allergyWarning}/>
                {errors.frequency && <p id="frequency-error" className="mt-1 text-sm text-brand-danger-600">{errors.frequency}</p>}
            </div>
        </div>

         <div>
            <label htmlFor="duration" className="block text-sm font-medium text-brand-gray-700">Duration</label>
            <input type="text" name="duration" id="duration" required className={`${baseInputClass} ${errors.duration ? errorInputClass : ''}`} onChange={handleChange} value={formData.duration} placeholder="e.g., 7 days, Ongoing" aria-invalid={!!errors.duration} aria-describedby="duration-error" disabled={!!allergyWarning}/>
            {errors.duration && <p id="duration-error" className="mt-1 text-sm text-brand-danger-600">{errors.duration}</p>}
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
            {allergyWarning ? (
                <>
                    <button type="button" onClick={() => setAllergyWarning(null)} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
                        Edit Medication
                    </button>
                    <button type="button" onClick={handleForcePrescribe} className="px-4 py-2 bg-brand-danger-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-danger-500">
                        Prescribe Anyway
                    </button>
                </>
            ) : (
                <>
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-brand-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
                        Add Medication
                    </button>
                </>
            )}
        </div>
      </form>
    </Modal>
  );
};

export default AddMedicationModal;