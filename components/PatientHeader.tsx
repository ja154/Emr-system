import React from 'react';
import type { Patient } from '../types';
import { AlertTriangleIcon, ChevronLeftIcon } from './icons';

interface PatientHeaderProps {
  patient: Patient;
  onBack?: () => void;
}

const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient, onBack }) => {
  return (
    <div>
       {onBack && (
        <button 
          onClick={onBack} 
          className="text-sm font-semibold text-brand-blue hover:underline mb-4 flex items-center gap-1"
          aria-label="Go back to dashboard"
        >
           <ChevronLeftIcon className="w-5 h-5" />
           Back to Dashboard
        </button>
      )}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={patient.avatarUrl}
            alt={patient.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md flex-shrink-0"
          />
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-brand-gray-900">{patient.name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-brand-gray-500 mt-2 text-sm">
              <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()} ({calculateAge(patient.dateOfBirth)} years)</span>
              <span className="hidden sm:inline text-brand-gray-300">|</span>
              <span>Gender: {patient.gender}</span>
              <span className="hidden sm:inline text-brand-gray-300">|</span>
              <span>MRN: {patient.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-brand-gray-500 mt-1 text-sm">
               <span>National ID: {patient.nationalId}</span>
               <span className="hidden sm:inline text-brand-gray-300">|</span>
               <span>NHIF No: {patient.nhifNumber}</span>
            </div>
          </div>
        </div>
        {patient.alerts && patient.alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-brand-gray-200">
            <h3 className="font-semibold text-sm text-red-800 flex items-center gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-red-600"/>
                Active Alerts
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {patient.alerts.map((alert, index) => (
                    <span key={index} className="px-2.5 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                        {alert}
                    </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHeader;