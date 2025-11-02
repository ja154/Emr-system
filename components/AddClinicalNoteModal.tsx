import React, { useState, useEffect, useCallback } from 'react';
import type { ClinicalNote } from '../types';
import Modal from './Modal';
import DatePicker from './DatePicker';
import { HistoryIcon } from './icons';

interface AddClinicalNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClinicalNote: (note: Omit<ClinicalNote, 'id' | 'author'>) => void;
  patientId: string;
}

const AddClinicalNoteModal: React.FC<AddClinicalNoteModalProps> = ({ isOpen, onClose, onAddClinicalNote, patientId }) => {
  const DRAFT_KEY = `emr_note_draft_${patientId}`;
  
  const initialFormData = {
    specialty: '',
    contentSnippet: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [savedDraft, setSavedDraft] = useState<typeof initialFormData | null>(null);

  // Auto-save draft to localStorage with debouncing
  useEffect(() => {
    if (!isOpen) return;

    // Do not save an empty note
    if (!formData.contentSnippet?.trim() && !formData.specialty?.trim()) {
        return;
    }

    const handler = setTimeout(() => {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        } catch (e) {
            console.error("Could not save note draft", e);
        }
    }, 1500); // debounce save by 1.5s

    return () => {
      clearTimeout(handler);
    };
  }, [formData, isOpen, DRAFT_KEY]);

  // Check for a saved draft when the modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const draftJson = localStorage.getItem(DRAFT_KEY);
        if (draftJson) {
          const parsedDraft = JSON.parse(draftJson);
          // Only show prompt if there is content to restore
          if (parsedDraft.contentSnippet?.trim() || parsedDraft.specialty?.trim()) {
             setSavedDraft(parsedDraft);
          }
        }
      } catch (e) {
        console.error("Failed to read note draft from localStorage", e);
        setSavedDraft(null);
      } finally {
        // Always reset form to initial state; user can choose to restore
        setFormData(initialFormData);
        setErrors({});
      }
    } else {
      // Clean up draft prompt when modal is not open
      setSavedDraft(null);
    }
  }, [isOpen, DRAFT_KEY]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, [DRAFT_KEY]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.specialty.trim()) newErrors.specialty = "Specialty is required.";
    if (!formData.contentSnippet.trim()) newErrors.contentSnippet = "Note content cannot be empty.";
    
    if (!formData.date) {
        newErrors.date = "Date is required.";
    } else if (new Date(formData.date) > new Date()) {
        newErrors.date = "Date cannot be in the future.";
    }

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

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, date: date }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddClinicalNote(formData);
      clearDraft();
      onClose();
    }
  };

  const handleRestoreDraft = () => {
    if(savedDraft) {
        setFormData(savedDraft);
    }
    setSavedDraft(null); // Hide prompt after restoring
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setSavedDraft(null);
  };

  const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-primary-500 focus:border-brand-primary-500 sm:text-sm";
  const errorInputClass = "border-brand-danger-500 text-brand-danger-900 placeholder-brand-danger-300 focus:ring-brand-danger-500 focus:border-brand-danger-500";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Clinical Note">
      {savedDraft && (
        <div className="p-3 mb-4 bg-brand-warning-50 border-l-4 border-brand-warning-400 rounded-md">
            <div className="flex">
                <div className="flex-shrink-0">
                    <HistoryIcon className="h-5 w-5 text-brand-warning-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold text-brand-warning-800">Unsaved Draft Found</p>
                    <p className="mt-1 text-sm text-brand-warning-700">
                        Would you like to restore your previous work?
                    </p>
                    <div className="mt-2">
                        <button type="button" onClick={handleRestoreDraft} className="font-semibold text-brand-primary-600 hover:underline text-sm mr-4">Restore Draft</button>
                        <button type="button" onClick={handleDiscardDraft} className="font-semibold text-brand-gray-600 hover:underline text-sm">Discard</button>
                    </div>
                </div>
            </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-brand-gray-700">Specialty</label>
                <input type="text" name="specialty" id="specialty" required className={`${baseInputClass} ${errors.specialty ? errorInputClass : ''}`} onChange={handleChange} value={formData.specialty} placeholder="e.g., Cardiology" aria-invalid={!!errors.specialty} aria-describedby="specialty-error"/>
                {errors.specialty && <p id="specialty-error" className="mt-1 text-sm text-brand-danger-600">{errors.specialty}</p>}
            </div>
             <div>
                <label htmlFor="date" className="block text-sm font-medium text-brand-gray-700">Date</label>
                <DatePicker
                    id="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    inputClassName={`${baseInputClass} ${errors.date ? errorInputClass : ''}`}
                    aria-invalid={!!errors.date}
                    aria-describedby="date-error"
                />
                {errors.date && <p id="date-error" className="mt-1 text-sm text-brand-danger-600">{errors.date}</p>}
            </div>
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
            {errors.contentSnippet && <p id="content-error" className="mt-1 text-sm text-brand-danger-600">{errors.contentSnippet}</p>}
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500">
            Add Note
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClinicalNoteModal;