import React, { useState, useEffect } from 'react';
import type { LabResult } from '../types';
import Modal from './Modal';

interface AddLabResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLabResult: (labResult: Omit<LabResult, 'id'>) => void;
}

const AddLabResultModal: React.FC<AddLabResultModalProps> = ({ isOpen, onClose, onAddLabResult }) => {
  const initialFormData = {
    testName: '',
    result: '',
    referenceRange: '',
    status: 'Normal' as LabResult['status'],
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
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
    if (!formData.testName.trim()) newErrors.testName = "Test name is required.";
    if (!formData.result.trim()) newErrors.result = "Result is required.";
    if (!formData.referenceRange.trim()) newErrors.referenceRange = "Reference range is required.";
    
    if (!formData.date) {
        newErrors.date = "Date is required.";
    } else if (new Date(formData.date) > new Date()) {
        newErrors.date = "Date cannot be in the future.";
    }
    
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddLabResult(formData);
      onClose();
    }
  };

  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  const errorInputClass = "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Lab Result">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="testName" className="block text-sm font-medium text-brand-gray-700">Test Name</label>
          <input type="text" name="testName" id="testName" required className={`${baseInputClass} ${errors.testName ? errorInputClass : ''}`} onChange={handleChange} value={formData.testName} placeholder="e.g., Hemoglobin A1c" aria-invalid={!!errors.testName} aria-describedby="testName-error"/>
           {errors.testName && <p id="testName-error" className="mt-1 text-sm text-red-600">{errors.testName}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-brand-gray-700">Date</label>
           <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`${baseInputClass} ${errors.date ? errorInputClass : ''}`}
            aria-invalid={!!errors.date}
            aria-describedby="date-error"
          />
          {errors.date && <p id="date-error" className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="result" className="block text-sm font-medium text-brand-gray-700">Result</label>
            <input type="text" name="result" id="result" required className={`${baseInputClass} ${errors.result ? errorInputClass : ''}`} onChange={handleChange} value={formData.result} placeholder="e.g., 7.8%" aria-invalid={!!errors.result} aria-describedby="result-error" />
            {errors.result && <p id="result-error" className="mt-1 text-sm text-red-600">{errors.result}</p>}
          </div>
          <div>
            <label htmlFor="referenceRange" className="block text-sm font-medium text-brand-gray-700">Reference Range</label>
            <input type="text" name="referenceRange" id="referenceRange" required className={`${baseInputClass} ${errors.referenceRange ? errorInputClass : ''}`} onChange={handleChange} value={formData.referenceRange} placeholder="e.g., 4.0-5.6%" aria-invalid={!!errors.referenceRange} aria-describedby="ref-error" />
            {errors.referenceRange && <p id="ref-error" className="mt-1 text-sm text-red-600">{errors.referenceRange}</p>}
          </div>
        </div>

        <div>
            <label htmlFor="status" className="block text-sm font-medium text-brand-gray-700">Status</label>
            <select name="status" id="status" required className={baseInputClass} onChange={handleChange} value={formData.status}>
                <option>Normal</option>
                <option>Abnormal</option>
                <option>Critical</option>
            </select>
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-blue border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Add Result
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLabResultModal;