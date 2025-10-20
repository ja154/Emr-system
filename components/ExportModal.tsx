import React, { useState, useMemo, useEffect } from 'react';
import type { Patient } from '../types';
import Modal from './Modal';
import { DownloadIcon } from './icons';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: { [key: string]: boolean }, format: 'csv' | 'pdf') => void;
  target: 'all' | Patient | null | undefined;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, target }) => {
  const isAllPatients = target === 'all';
  
  // Fix: Explicitly type the constant to ensure correct type inference for EXPORT_OPTIONS_CONFIG.
  const EXPORT_OPTIONS_CONFIG: { [key: string]: { label: string; defaultChecked: boolean } } = useMemo(() => (isAllPatients
    ? {
        demographics: { label: 'Patient Demographics', defaultChecked: true },
        alerts: { label: 'Active Alerts', defaultChecked: true },
      }
    : {
        demographics: { label: 'Patient Demographics', defaultChecked: true },
        alerts: { label: 'Active Alerts', defaultChecked: true },
        vitals: { label: 'Vitals History', defaultChecked: true },
        labs: { label: 'Lab Results', defaultChecked: true },
        medications: { label: 'Medications', defaultChecked: true },
        notes: { label: 'Clinical Notes', defaultChecked: true },
      }), [isAllPatients]);

  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initialOptions: { [key: string]: boolean } = {};
    for (const key in EXPORT_OPTIONS_CONFIG) {
        initialOptions[key] = EXPORT_OPTIONS_CONFIG[key as keyof typeof EXPORT_OPTIONS_CONFIG].defaultChecked;
    }
    return initialOptions;
  });
  
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');

  useEffect(() => {
    if (isOpen) {
        const initialOptions: { [key: string]: boolean } = {};
        for (const key in EXPORT_OPTIONS_CONFIG) {
            initialOptions[key] = EXPORT_OPTIONS_CONFIG[key as keyof typeof EXPORT_OPTIONS_CONFIG].defaultChecked;
        }
        setSelectedOptions(initialOptions);
        setFormat('csv'); // Reset format on open
    }
  }, [isOpen, EXPORT_OPTIONS_CONFIG]);


  const handleToggleOption = (option: string) => {
    setSelectedOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSelectAll = (select: boolean) => {
    const newOptions: { [key: string]: boolean } = {};
    for (const key in EXPORT_OPTIONS_CONFIG) {
      newOptions[key] = select;
    }
    setSelectedOptions(newOptions);
  };

  const handleSubmit = () => {
    onExport(selectedOptions, format);
  };

  const patientName = target && target !== 'all' ? target.name : '';
  const title = isAllPatients ? 'Export All Patient Data' : `Export Data for ${patientName}`;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div>
        <p className="text-sm text-brand-gray-600 mb-4">Select the data sections to include in the export.</p>
        
        <div className="space-y-3">
          {Object.entries(EXPORT_OPTIONS_CONFIG).map(([key, { label }]) => (
            <label key={key} className="flex items-center space-x-3 p-3 bg-brand-gray-50 rounded-lg hover:bg-brand-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedOptions[key] || false}
                onChange={() => handleToggleOption(key)}
                className="h-5 w-5 rounded border-brand-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              <span className="text-sm font-medium text-brand-gray-700">{label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm">
            <button type="button" onClick={() => handleSelectAll(true)} className="font-semibold text-brand-blue hover:underline">Select All</button>
            <button type="button" onClick={() => handleSelectAll(false)} className="font-semibold text-brand-blue hover:underline">Deselect All</button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-brand-gray-700 mb-2">Export Format</label>
          <div className="flex items-center space-x-6 bg-brand-gray-100 p-2 rounded-lg w-min">
            <label className={`flex items-center space-x-2 cursor-pointer px-3 py-1 rounded-md transition-all ${format === 'csv' ? 'bg-white shadow-sm' : ''}`}>
              <input
                type="radio"
                name="export-format"
                value="csv"
                checked={format === 'csv'}
                onChange={() => setFormat('csv')}
                className="sr-only"
              />
              <span className={`text-sm font-semibold ${format === 'csv' ? 'text-brand-blue' : 'text-brand-gray-600'}`}>CSV</span>
            </label>
            <label className={`flex items-center space-x-2 cursor-pointer px-3 py-1 rounded-md transition-all ${format === 'pdf' ? 'bg-white shadow-sm' : ''}`}>
              <input
                type="radio"
                name="export-format"
                value="pdf"
                checked={format === 'pdf'}
                onChange={() => setFormat('pdf')}
                className="sr-only"
              />
              <span className={`text-sm font-semibold ${format === 'pdf' ? 'text-brand-blue' : 'text-brand-gray-600'}`}>PDF</span>
            </label>
          </div>
        </div>

        <div className="pt-6 mt-4 border-t border-brand-gray-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!Object.values(selectedOptions).some(v => v)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-brand-gray-300 disabled:cursor-not-allowed"
          >
            <DownloadIcon className="w-5 h-5"/>
            Export {format.toUpperCase()}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;