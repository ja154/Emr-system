import React from 'react';
import type { Patient } from '../types';
import { AlertTriangleIcon } from './icons';

interface PatientHeaderProps {
  patient: Patient;
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

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={patient.avatarUrl}
          alt={patient.name}
          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
        />
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-brand-gray-900">{patient.name}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-brand-gray-500 mt-2">
            <span>DOB: {patient.dateOfBirth} ({calculateAge(patient.dateOfBirth)} years)</span>
            <span className="hidden sm:inline">|</span>
            <span>Gender: {patient.gender}</span>
            <span className="hidden sm:inline">|</span>
            <span>MRN: {patient.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-brand-gray-500 mt-1">
             <span>National ID: {patient.nationalId}</span>
             <span className="hidden sm:inline">|</span>
             <span>NHIF No: {patient.nhifNumber}</span>
          </div>
        </div>
      </div>
      {patient.alerts && patient.alerts.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Alerts</h3>
            <p className="text-red-700">{patient.alerts.join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHeader;
