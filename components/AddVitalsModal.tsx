import React, { useState, useEffect } from 'react';
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;

    if (!formData.bloodPressure.trim()) {
      newErrors.bloodPressure = 'Blood pressure is required.';
    } else if (!bpRegex.test(formData.bloodPressure)) {
      newErrors.bloodPressure = 'Format must be Systolic/Diastolic, e.g., 120/80.';
    } else {
      const [systolic, diastolic] = formData.bloodPressure.split('/').map(Number);
      if (systolic <= diastolic) newErrors.bloodPressure = 'Systolic must be greater than diastolic.';
      if (systolic < 50 || systolic > 300) newErrors.bloodPressure = 'Systolic pressure is out of range (50-300 mmHg).';
      if (diastolic < 30 || diastolic > 200) newErrors.bloodPressure = 'Diastolic pressure is out of range (30-200 mmHg).';
    }

    const hr = Number(formData.heartRate);
    if (!formData.heartRate) newErrors.heartRate = 'Heart rate is required.';
    else if (isNaN(hr) || hr < 30 || hr > 250) newErrors.heartRate = 'Range: 30-250 bpm.';

    const temp = Number(formData.temperature);
    if (!formData.temperature) newErrors.temperature = 'Temperature is required.';
    else if (isNaN(temp) || temp < 34.0 || temp > 42.0) newErrors.temperature = 'Range: 34.0-42.0 °C.';
    
    const rr = Number(formData.respiratoryRate);
    if (!formData.respiratoryRate) newErrors.respiratoryRate = 'Rate is required.';
    else if (isNaN(rr) || rr < 5 || rr > 60) newErrors.respiratoryRate = 'Range: 5-60 breaths/min.';

    const spo2 = Number(formData.oxygenSaturation);
    if (!formData.oxygenSaturation) newErrors.oxygenSaturation = 'SpO2 is required.';
    else if (isNaN(spo2) || spo2 < 50 || spo2 > 100) newErrors.oxygenSaturation = 'Range: 50-100%.';

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
      onAddVitals({
        bloodPressure: formData.bloodPressure,
        heartRate: Number(formData.heartRate),
        temperature: Number(formData.temperature),
        respiratoryRate: Number(formData.respiratoryRate),
        oxygenSaturation: Number(formData.oxygenSaturation),
      });
      onClose();
    }
  };

  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  const errorInputClass = "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Vitals Reading">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="bloodPressure" className="block text-sm font-medium text-brand-gray-700">Blood Pressure (mmHg)</label>
          <input type="text" name="bloodPressure" id="bloodPressure" required className={`${baseInputClass} ${errors.bloodPressure ? errorInputClass : ''}`} onChange={handleChange} value={formData.bloodPressure} placeholder="120/80" aria-invalid={!!errors.bloodPressure} aria-describedby="bp-error" />
           {errors.bloodPressure && <p id="bp-error" className="mt-1 text-sm text-red-600">{errors.bloodPressure}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="heartRate" className="block text-sm font-medium text-brand-gray-700">Heart Rate (bpm)</label>
            <input type="number" name="heartRate" id="heartRate" required className={`${baseInputClass} ${errors.heartRate ? errorInputClass : ''}`} onChange={handleChange} value={formData.heartRate} placeholder="75" aria-invalid={!!errors.heartRate} aria-describedby="hr-error"/>
            {errors.heartRate && <p id="hr-error" className="mt-1 text-sm text-red-600">{errors.heartRate}</p>}
          </div>

          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-brand-gray-700">Temperature (°C)</label>
            <input type="number" step="0.1" name="temperature" id="temperature" required className={`${baseInputClass} ${errors.temperature ? errorInputClass : ''}`} onChange={handleChange} value={formData.temperature} placeholder="36.8" aria-invalid={!!errors.temperature} aria-describedby="temp-error"/>
             {errors.temperature && <p id="temp-error" className="mt-1 text-sm text-red-600">{errors.temperature}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="respiratoryRate" className="block text-sm font-medium text-brand-gray-700">Respiratory Rate (breaths/min)</label>
            <input type="number" name="respiratoryRate" id="respiratoryRate" required className={`${baseInputClass} ${errors.respiratoryRate ? errorInputClass : ''}`} onChange={handleChange} value={formData.respiratoryRate} placeholder="16" aria-invalid={!!errors.respiratoryRate} aria-describedby="rr-error"/>
            {errors.respiratoryRate && <p id="rr-error" className="mt-1 text-sm text-red-600">{errors.respiratoryRate}</p>}
          </div>
          <div>
            <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-brand-gray-700">Oxygen Saturation (%)</label>
            <input type="number" name="oxygenSaturation" id="oxygenSaturation" required className={`${baseInputClass} ${errors.oxygenSaturation ? errorInputClass : ''}`} onChange={handleChange} value={formData.oxygenSaturation} placeholder="99" aria-invalid={!!errors.oxygenSaturation} aria-describedby="spo2-error"/>
            {errors.oxygenSaturation && <p id="spo2-error" className="mt-1 text-sm text-red-600">{errors.oxygenSaturation}</p>}
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
