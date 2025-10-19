import type { Patient } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'MRN0012345',
    name: 'Amina Wanjala',
    dateOfBirth: '1985-05-15',
    gender: 'Female',
    nationalId: '12345678',
    nhifNumber: 'NHIF-987654',
    avatarUrl: 'https://picsum.photos/seed/patient1/200/200',
    alerts: ['Penicillin Allergy', 'Hypertension'],
    vitals: [
      {
        date: '2024-08-20T09:00:00Z',
        bloodPressure: '145/92',
        heartRate: 88,
        temperature: 37.1,
        respiratoryRate: 18,
        oxygenSaturation: 97,
      },
      {
        date: '2024-08-19T14:30:00Z',
        bloodPressure: '142/90',
        heartRate: 85,
        temperature: 37.0,
        respiratoryRate: 18,
        oxygenSaturation: 98,
      }
    ],
    labs: [
      { id: 'lab1', testName: 'Hemoglobin A1c', result: '7.8%', referenceRange: '4.0-5.6%', date: '2024-08-15', status: 'Abnormal' },
      { id: 'lab2', testName: 'Creatinine', result: '1.2 mg/dL', referenceRange: '0.6-1.1 mg/dL', date: '2024-08-15', status: 'Abnormal' },
      { id: 'lab3', testName: 'Potassium', result: '4.1 mEq/L', referenceRange: '3.5-5.0 mEq/L', date: '2024-08-15', status: 'Normal' },
    ],
    medications: [
      { id: 'med1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: 'Ongoing' },
      { id: 'med2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: 'Ongoing' },
    ],
    notes: [
        { id: 'note1', date: '2024-08-15', author: 'Dr. John Carter', specialty: 'Cardiology', contentSnippet: 'Patient presents for routine follow-up for hypertension and type 2 diabetes. BP remains elevated...' },
        { id: 'note2', date: '2024-05-10', author: 'Dr. Susan Lewis', specialty: 'Endocrinology', contentSnippet: 'Reviewed A1c results. Discussed importance of diet and medication adherence.' },
    ],
    reminders: [
        { id: 'rem1', title: 'Follow-up appointment', dueDate: '2024-09-15', status: 'pending' },
        { id: 'rem2', title: 'Medication refill (Lisinopril)', dueDate: '2024-08-30', status: 'pending' },
        { id: 'rem3', title: 'Check fasting blood sugar', dueDate: '2024-08-22', status: 'completed' },
    ],
  },
  {
    id: 'MRN0012346',
    name: 'David Otieno',
    dateOfBirth: '1972-11-30',
    gender: 'Male',
    nationalId: '87654321',
    nhifNumber: 'NHIF-123456',
    avatarUrl: 'https://picsum.photos/seed/patient2/200/200',
    alerts: ['Asthma'],
    vitals: [
       {
        date: '2024-07-01T10:15:00Z',
        bloodPressure: '120/80',
        heartRate: 75,
        temperature: 36.8,
        respiratoryRate: 16,
        oxygenSaturation: 99,
      }
    ],
    labs: [
       { id: 'lab4', testName: 'Total Cholesterol', result: '190 mg/dL', referenceRange: '<200 mg/dL', date: '2024-07-01', status: 'Normal' },
       { id: 'lab5', testName: 'TSH', result: '2.5 mIU/L', referenceRange: '0.4-4.0 mIU/L', date: '2024-07-01', status: 'Normal' },
    ],
    medications: [
      { id: 'med3', name: 'Salbutamol Inhaler', dosage: 'As needed', frequency: 'For wheezing', duration: 'As needed' },
    ],
    notes: [
        { id: 'note3', date: '2024-07-01', author: 'Dr. Peter Benton', specialty: 'General Practice', contentSnippet: 'Annual physical. Patient reports good control of asthma. Lungs clear to auscultation.' },
    ],
    reminders: [
        { id: 'rem4', title: 'Annual physical due', dueDate: '2025-07-01', status: 'pending' },
    ]
  },
];