import React, { useState, useEffect } from 'react';
import type { Reminder } from '../types';
import Modal from './Modal';
import DatePicker from './DatePicker';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'status'>) => void;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ isOpen, onClose, onAddReminder }) => {
  const initialFormData = {
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
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
    if (!formData.title.trim()) {
      newErrors.title = "Reminder title is required.";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title should not exceed 100 characters.";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required.";
    } else if (new Date(formData.dueDate) < today) {
      newErrors.dueDate = "Due date cannot be in the past.";
    }

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

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
    if (errors.dueDate) {
      setErrors(prev => ({ ...prev, dueDate: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddReminder(formData);
      onClose();
    }
  };
  
  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm";
  const errorInputClass = "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Reminder">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-brand-gray-700">Reminder Title</label>
          <input 
            type="text" 
            name="title" 
            id="title" 
            required 
            className={`${baseInputClass} ${errors.title ? errorInputClass : ''}`} 
            onChange={handleChange} 
            value={formData.title} 
            placeholder="e.g., Schedule follow-up appointment"
            aria-invalid={!!errors.title}
            aria-describedby="title-error"
          />
          {errors.title && <p id="title-error" className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-brand-gray-700">Due Date</label>
          <DatePicker
            id="dueDate"
            value={formData.dueDate}
            onChange={handleDateChange}
            inputClassName={`${baseInputClass} ${errors.dueDate ? errorInputClass : ''}`}
            aria-invalid={!!errors.dueDate}
            aria-describedby="dueDate-error"
          />
          {errors.dueDate && <p id="dueDate-error" className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-blue border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Add Reminder
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddReminderModal;
