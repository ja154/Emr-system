import React, { useState } from 'react';
import type { Vitals } from '../types';
import Modal from './Modal';

interface AddVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVitals: (vitals: Omit<Vitals, 'date'>) => void;
}

const AddVitalsModal: React.FC<AddVitalsModalProps> = ({ isOpen, onClose, onAddVitals }) => {
  const initialFormData = {
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVitals({
      bloodPressure: formData.bloodPressure,
      heartRate: Number(formData.heartRate),
      temperature: Number(formData.temperature),
      respiratoryRate: Number(formData.respiratoryRate),
      oxygenSaturation: Number(formData.oxygenSaturation),
    });
    setFormData(initialFormData);
    onClose();
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Vitals Reading">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bloodPressure" className="block text-sm font-medium text-brand-gray-700">Blood Pressure (e.g., 120/80)</label>
          <input type="text" name="bloodPressure" id="bloodPressure" required className={inputClass} onChange={handleChange} value={formData.bloodPressure} placeholder="120/80" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="heartRate" className="block text-sm font-medium text-brand-gray-700">Heart Rate (bpm)</label>
            <input type="number" name="heartRate" id="heartRate" required className={inputClass} onChange={handleChange} value={formData.heartRate} placeholder="75" />
          </div>

          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-brand-gray-700">Temperature (°C)</label>
            <input type="number" step="0.1" name="temperature" id="temperature" required className={inputClass} onChange={handleChange} value={formData.temperature} placeholder="36.8" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="respiratoryRate" className="block text-sm font-medium text-brand-gray-700">Respiratory Rate</label>
            <input type="number" name="respiratoryRate" id="respiratoryRate" required className={inputClass} onChange={handleChange} value={formData.respiratoryRate} placeholder="16" />
          </div>
          <div>
            <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-brand-gray-700">Oxygen Saturation (%)</label>
            <input type="number" name="oxygenSaturation" id="oxygenSaturation" required className={inputClass} onChange={handleChange} value={formData.oxygenSaturation} placeholder="99" />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-blue border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Add Vitals
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVitalsModal;
