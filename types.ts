export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationalId: string;
  nhifNumber: string;
  avatarUrl: string;
  alerts: string[];
}

export interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

export interface LabResult {
  id: string;
  testName: string;
  result: string;
  referenceRange: string;
  date: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  author: string;
  specialty: string;
  contentSnippet: string;
}

export interface AiSummary {
    summary: string;
    keyConcerns: string[];
    suggestedActions: string[];
}
