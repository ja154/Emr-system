export interface Vitals {
  date: string;
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
  duration: string;
}

export interface ClinicalNote {
  id:string;
  date: string;
  author: string;
  specialty: string;
  contentSnippet: string;
}

export interface Reminder {
    id: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'completed';
}

export interface AiSummary {
    summary: string;
    keyConcerns: string[];
    suggestedActions: string[];
}

export type TimelineEventType = 'Admission' | 'Diagnosis' | 'Surgery' | 'Discharge' | 'Medication' | 'Lab';

export interface TimelineEvent {
    id: string;
    date: string;
    eventType: TimelineEventType;
    title: string;
    description: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationalId: string;
  nhifNumber: string;
  avatarUrl: string;
  alerts: string[];
  vitals: Vitals[];
  labs: LabResult[];
  medications: Medication[];
  notes: ClinicalNote[];
  reminders: Reminder[];
  timeline: TimelineEvent[];
}
