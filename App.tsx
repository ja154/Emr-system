import React, { useState } from 'react';
import type { Patient, Vitals, LabResult, Medication, ClinicalNote } from './types';
import PatientHeader from './components/PatientHeader';
import VitalsCard from './components/VitalsCard';
import RecentLabsCard from './components/RecentLabsCard';
import MedicationsCard from './components/MedicationsCard';
import ClinicalNotesCard from './components/ClinicalNotesCard';
import AiSummaryCard from './components/AiSummaryCard';
import { StethoscopeIcon } from './components/icons';

const MOCK_PATIENT: Patient = {
  id: 'MRN0012345',
  name: 'Amina Wanjala',
  dateOfBirth: '1985-05-15',
  gender: 'Female',
  nationalId: '12345678',
  nhifNumber: 'NHIF-987654',
  avatarUrl: 'https://picsum.photos/seed/patient1/200/200',
  alerts: ['Penicillin Allergy', 'Hypertension'],
};

const MOCK_VITALS: Vitals = {
  bloodPressure: '145/92',
  heartRate: 88,
  temperature: 37.1,
  respiratoryRate: 18,
  oxygenSaturation: 97,
};

const MOCK_LABS: LabResult[] = [
  { id: 'lab1', testName: 'Hemoglobin A1c', result: '7.8%', referenceRange: '4.0-5.6%', date: '2024-08-15', status: 'Abnormal' },
  { id: 'lab2', testName: 'Creatinine', result: '1.2 mg/dL', referenceRange: '0.6-1.1 mg/dL', date: '2024-08-15', status: 'Abnormal' },
  { id: 'lab3', testName: 'Potassium', result: '4.1 mEq/L', referenceRange: '3.5-5.0 mEq/L', date: '2024-08-15', status: 'Normal' },
  { id: 'lab4', testName: 'HIV Viral Load', result: '<20 copies/mL', referenceRange: 'Undetectable', date: '2024-06-20', status: 'Normal' },
];

const MOCK_MEDICATIONS: Medication[] = [
  { id: 'med1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
  { id: 'med2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
  { id: 'med3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' },
];

const MOCK_NOTES: ClinicalNote[] = [
    { id: 'note1', date: '2024-08-15', author: 'Dr. John Carter', specialty: 'Cardiology', contentSnippet: 'Patient presents for routine follow-up for hypertension and type 2 diabetes. BP remains elevated...' },
    { id: 'note2', date: '2024-05-10', author: 'Dr. Susan Lewis', specialty: 'Endocrinology', contentSnippet: 'Reviewed A1c results. Discussed importance of diet and medication adherence. Will continue current regimen.' },
    { id: 'note3', date: '2024-02-01', author: 'Dr. Peter Benton', specialty: 'General Practice', contentSnippet: 'Annual physical exam. All systems reviewed. Patient is stable.' },
];

const App: React.FC = () => {
  const [patient] = useState<Patient>(MOCK_PATIENT);
  const [vitals] = useState<Vitals>(MOCK_VITALS);
  const [labs] = useState<LabResult[]>(MOCK_LABS);
  const [medications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [notes] = useState<ClinicalNote[]>(MOCK_NOTES);
  
  const fullPatientData = {
    patient,
    vitals,
    labs,
    medications,
    notes
  };

  return (
    <div className="min-h-screen bg-brand-gray-50 text-brand-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-brand-blue-light text-brand-blue-dark p-2 rounded-lg">
                <StethoscopeIcon className="w-6 h-6" />
             </div>
             <h1 className="text-xl font-bold text-brand-gray-900">Kenya EMR Clinical Dashboard</h1>
           </div>
        </div>
      </header>
      
      <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <PatientHeader patient={patient} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 xl:grid-cols-4">
            <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-1">
                        <VitalsCard vitals={vitals} />
                    </div>
                    <div className="xl:col-span-2">
                        <MedicationsCard medications={medications} />
                    </div>
                </div>
                <div className="grid grid-cols-1">
                     <RecentLabsCard labs={labs} />
                </div>
                 <div className="grid grid-cols-1">
                     <ClinicalNotesCard notes={notes} />
                </div>
            </div>
            
            <aside className="lg:col-span-3 xl:col-span-1">
                 <AiSummaryCard patientData={fullPatientData} />
            </aside>
        </div>
      </main>
    </div>
  );
};

export default App;
