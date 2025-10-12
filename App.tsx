import React, { useState, useEffect } from 'react';
import type { Patient, Vitals, LabResult, Medication, ClinicalNote } from './types';
import { MOCK_PATIENTS } from './data';
import PatientHeader from './components/PatientHeader';
import VitalsCard from './components/VitalsCard';
import RecentLabsCard from './components/RecentLabsCard';
import MedicationsCard from './components/MedicationsCard';
import ClinicalNotesCard from './components/ClinicalNotesCard';
import AiSummaryCard from './components/AiSummaryCard';
import AlertsCard from './components/AlertsCard';
import AddPatientModal from './components/AddPatientModal';
import AddVitalsModal from './components/AddVitalsModal';
import AddLabResultModal from './components/AddLabResultModal';
import AddMedicationModal from './components/AddMedicationModal';
import AddClinicalNoteModal from './components/AddClinicalNoteModal';
import AddAlertModal from './components/AddAlertModal';
import ConfirmationModal from './components/ConfirmationModal';
import ExportModal from './components/ExportModal';
import { exportToCsv } from './utils';
import { StethoscopeIcon, UserPlusIcon, ChevronRightIcon, SearchIcon, LayoutGridIcon, BeakerIcon, PillIcon, ClipboardTextIcon, DownloadIcon } from './components/icons';

const APP_STORAGE_KEY = 'emr_patients_data';

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

const PatientCard: React.FC<{ patient: Patient; onSelect: () => void }> = ({ patient, onSelect }) => (
  <div
    onClick={onSelect}
    className="bg-white rounded-xl shadow-sm border border-brand-gray-200 h-full flex flex-col cursor-pointer hover:shadow-md hover:border-brand-blue transition-all duration-200"
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === 'Enter' && onSelect()}
    aria-label={`View record for ${patient.name}`}
  >
    <div className="p-4 flex items-center space-x-4">
      <img
        src={patient.avatarUrl}
        alt={patient.name}
        className="w-16 h-16 rounded-full border-2 border-brand-gray-100"
      />
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-brand-gray-900">{patient.name}</h3>
        <p className="text-sm text-brand-gray-500">
          {patient.gender}, {calculateAge(patient.dateOfBirth)} years
        </p>
        <p className="text-xs text-brand-gray-400 mt-1">MRN: {patient.id}</p>
      </div>
    </div>
    <div className="mt-auto p-4 border-t border-brand-gray-100 flex justify-between items-center text-sm text-brand-blue font-semibold">
      <span>View Record</span>
      <ChevronRightIcon className="w-5 h-5" />
    </div>
  </div>
);

const EmptyDashboard: React.FC<{ onAddPatient: () => void }> = ({ onAddPatient }) => {
    return (
        <div className="text-center bg-white rounded-xl border-2 border-dashed border-brand-gray-200 p-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-blue-light">
                <StethoscopeIcon className="h-8 w-8 text-brand-blue" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-brand-gray-900">Welcome to the EMR Dashboard</h3>
            <p className="mt-2 text-base text-brand-gray-500">
                There are no patient records yet. Get started by adding your first patient.
            </p>
            <div className="mt-6">
                <button
                    type="button"
                    onClick={onAddPatient}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green text-white font-semibold rounded-lg shadow-sm hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                >
                    <UserPlusIcon className="-ml-1 h-5 w-5" />
                    Add New Patient
                </button>
            </div>
        </div>
    );
};


type Tab = 'overview' | 'labs' | 'medications' | 'notes';

const App: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>(() => {
        try {
            const localData = localStorage.getItem(APP_STORAGE_KEY);
            if (localData) {
                return JSON.parse(localData);
            }
            localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(MOCK_PATIENTS));
            return MOCK_PATIENTS;
        } catch (error) {
            console.error("Could not read/initialize patients data from localStorage", error);
            return MOCK_PATIENTS;
        }
    });

  useEffect(() => {
    try {
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(patients));
    } catch (error) {
        console.error("Could not save patients data to localStorage", error);
    }
  }, [patients]);


  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Modal states
  const [isAddPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [isAddVitalsModalOpen, setAddVitalsModalOpen] = useState(false);
  const [isAddLabModalOpen, setAddLabModalOpen] = useState(false);
  const [isAddMedicationModalOpen, setAddMedicationModalOpen] = useState(false);
  const [isAddNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [isAddAlertModalOpen, setAddAlertModalOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [exportModalState, setExportModalState] = useState<{ isOpen: boolean; target: 'all' | string | null }>({
    isOpen: false,
    target: null,
  });
  
  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('overview'); // Reset to overview tab when selecting a new patient
  };

  const handleBackToDashboard = () => {
    setSelectedPatientId(null);
  };

  const updatePatientData = (patientId: string, updatedData: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, ...updatedData } : p));
  };

  const handleAddNewPatient = (newPatientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
        id: `MRN${String(Date.now()).slice(-7)}`,
        ...newPatientData
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const handleAddVitals = (vitalsData: Omit<Vitals, 'date'>) => {
    if (!selectedPatientId) return;
    const newVitals: Vitals = { ...vitalsData, date: new Date().toISOString() };
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { vitals: [newVitals, ...currentPatient.vitals] });
    }
  }

  const handleAddLabResult = (labData: Omit<LabResult, 'id'>) => {
    if (!selectedPatientId) return;
    const newLab: LabResult = { ...labData, id: `lab${Date.now()}` };
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { labs: [...currentPatient.labs, newLab] });
    }
  }

  const handleAddMedication = (medData: Omit<Medication, 'id'>) => {
     if (!selectedPatientId) return;
    const newMed: Medication = { ...medData, id: `med${Date.now()}` };
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { medications: [...currentPatient.medications, newMed] });
    }
  }

  const handleAddClinicalNote = (noteData: Omit<ClinicalNote, 'id' | 'author'>) => {
     if (!selectedPatientId) return;
    const newNote: ClinicalNote = { ...noteData, id: `note${Date.now()}`, author: 'Dr. User' };
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { notes: [newNote, ...currentPatient.notes] });
    }
  }

  const handleAddAlert = (alert: string) => {
    if (!selectedPatientId) return;
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { alerts: [...currentPatient.alerts, alert] });
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };
  
  const handleRemoveAlert = (alertToRemove: string) => {
    if (!selectedPatientId) return;
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { alerts: currentPatient.alerts.filter(a => a !== alertToRemove) });
    }
    handleCloseConfirmation();
  };

  const requestRemoveAlert = (alert: string) => {
    setConfirmationState({
        isOpen: true,
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the alert "${alert}"? This action cannot be undone.`,
        onConfirm: () => handleRemoveAlert(alert),
    });
  };

  const handleRemoveLabResult = (labId: string) => {
    if (!selectedPatientId) return;
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { labs: currentPatient.labs.filter(l => l.id !== labId) });
    }
    handleCloseConfirmation();
  };

  const requestRemoveLabResult = (labId: string) => {
    const lab = selectedPatient?.labs.find(l => l.id === labId);
    if (!lab) return;
    setConfirmationState({
        isOpen: true,
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the lab result for "${lab.testName}" from ${new Date(lab.date).toLocaleDateString()}? This action cannot be undone.`,
        onConfirm: () => handleRemoveLabResult(labId),
    });
  };

  const handleRemoveMedication = (medId: string) => {
    if (!selectedPatientId) return;
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { medications: currentPatient.medications.filter(m => m.id !== medId) });
    }
    handleCloseConfirmation();
  };

  const requestRemoveMedication = (medId: string) => {
      const med = selectedPatient?.medications.find(m => m.id === medId);
      if (!med) return;
      setConfirmationState({
          isOpen: true,
          title: 'Confirm Deletion',
          message: `Are you sure you want to delete the medication "${med.name} ${med.dosage}"? This action cannot be undone.`,
          onConfirm: () => handleRemoveMedication(medId),
      });
  };

  const handleRemoveClinicalNote = (noteId: string) => {
    if (!selectedPatientId) return;
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { notes: currentPatient.notes.filter(n => n.id !== noteId) });
    }
    handleCloseConfirmation();
  };

  const requestRemoveClinicalNote = (noteId: string) => {
    const note = selectedPatient?.notes.find(n => n.id === noteId);
    if (!note) return;
    setConfirmationState({
        isOpen: true,
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the clinical note from ${note.date} by ${note.author}? This action cannot be undone.`,
        onConfirm: () => handleRemoveClinicalNote(noteId),
    });
  };

  const handleExport = (options: { [key: string]: boolean }) => {
    if (!exportModalState.target) return;

    if (exportModalState.target === 'all') {
      const dataToExport = patients.map(p => {
        const row: { [key: string]: any } = {};
        if (options.demographics) {
          row['MRN'] = p.id;
          row['Name'] = p.name;
          row['Date of Birth'] = p.dateOfBirth;
          row['Gender'] = p.gender;
          row['National ID'] = p.nationalId;
          row['NHIF Number'] = p.nhifNumber;
        }
        if (options.alerts) {
          row['Alerts'] = p.alerts.join('; ');
        }
        return row;
      }).filter(row => Object.keys(row).length > 0);

      if (dataToExport.length > 0) {
        exportToCsv(dataToExport, 'all_patients_summary.csv');
      }
    } else {
      const patient = patients.find(p => p.id === exportModalState.target);
      if (!patient) return;
      const patientName = patient.name.replace(/\s+/g, '_').toLowerCase();

      if (options.demographics) {
        exportToCsv([{
            'MRN': patient.id,
            'Name': patient.name,
            'Date of Birth': patient.dateOfBirth,
            'Gender': patient.gender,
            'National ID': patient.nationalId,
            'NHIF Number': patient.nhifNumber,
        }], `${patientName}_demographics.csv`);
      }
      if (options.alerts && patient.alerts.length > 0) {
        exportToCsv(patient.alerts.map(a => ({'Alert': a})), `${patientName}_alerts.csv`);
      }
      if (options.vitals && patient.vitals.length > 0) {
        exportToCsv(patient.vitals.map(v => ({
            'Date': new Date(v.date).toLocaleString(),
            'Blood Pressure (mmHg)': v.bloodPressure,
            'Heart Rate (bpm)': v.heartRate,
            'Temperature (°C)': v.temperature,
            'Respiratory Rate (breaths/min)': v.respiratoryRate,
            'Oxygen Saturation (%)': v.oxygenSaturation,
        })), `${patientName}_vitals.csv`);
      }
      if (options.labs && patient.labs.length > 0) {
         exportToCsv(patient.labs.map(l => ({
            'Date': new Date(l.date).toLocaleDateString(),
            'Test Name': l.testName,
            'Result': l.result,
            'Reference Range': l.referenceRange,
            'Status': l.status,
         })), `${patientName}_labs.csv`);
      }
      if (options.medications && patient.medications.length > 0) {
        exportToCsv(patient.medications.map(m => ({
            'Name': m.name,
            'Dosage': m.dosage,
            'Frequency': m.frequency,
            'Duration': m.duration,
        })), `${patientName}_medications.csv`);
      }
      if (options.notes && patient.notes.length > 0) {
        exportToCsv(patient.notes.map(n => ({
            'Date': new Date(n.date + 'T00:00:00').toLocaleDateString(),
            'Author': n.author,
            'Specialty': n.specialty,
            'Note': n.contentSnippet,
        })), `${patientName}_notes.csv`);
      }
    }

    setExportModalState({ isOpen: false, target: null });
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const TabButton: React.FC<{ tab: Tab, label: string, icon: React.ReactNode }> = ({ tab, label, icon }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors duration-200 ${
            activeTab === tab 
            ? 'border-b-2 border-brand-blue text-brand-blue' 
            : 'text-brand-gray-500 hover:text-brand-gray-800'
        }`}
        role="tab"
        aria-selected={activeTab === tab}
    >
        {icon}
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-gray-50 text-brand-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-20">
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
        {selectedPatient ? (
            <>
                <PatientHeader 
                    patient={selectedPatient} 
                    onBack={handleBackToDashboard} 
                    onExport={() => setExportModalState({ isOpen: true, target: selectedPatient.id })}
                />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-brand-gray-200">
                            <nav className="flex" role="tablist" aria-label="Patient data tabs">
                                <TabButton tab="overview" label="Overview" icon={<LayoutGridIcon className="w-5 h-5"/>} />
                                <TabButton tab="labs" label="Labs" icon={<BeakerIcon className="w-5 h-5"/>} />
                                <TabButton tab="medications" label="Medications" icon={<PillIcon className="w-5 h-5"/>} />
                                <TabButton tab="notes" label="Notes" icon={<ClipboardTextIcon className="w-5 h-5"/>} />
                            </nav>
                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div role="tabpanel" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <VitalsCard vitals={selectedPatient.vitals} onAdd={() => setAddVitalsModalOpen(true)} />
                                        <AlertsCard alerts={selectedPatient.alerts} onAdd={() => setAddAlertModalOpen(true)} onRemove={requestRemoveAlert}/>
                                    </div>
                                )}
                                {activeTab === 'labs' && <div role="tabpanel"><RecentLabsCard labs={selectedPatient.labs} onAdd={() => setAddLabModalOpen(true)} onRemove={requestRemoveLabResult} /></div>}
                                {activeTab === 'medications' && <div role="tabpanel"><MedicationsCard medications={selectedPatient.medications} onAdd={() => setAddMedicationModalOpen(true)} onRemove={requestRemoveMedication} /></div>}
                                {activeTab === 'notes' && <div role="tabpanel"><ClinicalNotesCard notes={selectedPatient.notes} onAdd={() => setAddNoteModalOpen(true)} onRemove={requestRemoveClinicalNote} /></div>}
                            </div>
                        </div>
                    </div>
                    
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                          <AiSummaryCard patientData={selectedPatient} />
                        </div>
                    </aside>
                </div>
            </>
        ) : (
             <div>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-brand-gray-900">Patient Dashboard</h1>
                     <div className="flex gap-4 items-center">
                        <div className="relative flex-grow md:flex-grow-0">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="w-5 h-5 text-brand-gray-400" />
                            </span>
                            <input
                                type="search"
                                placeholder="Search by patient name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition-all"
                                aria-label="Search patients"
                            />
                        </div>
                        <button
                            onClick={() => setExportModalState({ isOpen: true, target: 'all' })}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-brand-gray-300 text-brand-gray-700 font-semibold rounded-lg shadow-sm hover:bg-brand-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            Export All
                        </button>
                        <button
                            onClick={() => setAddPatientModalOpen(true)}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-green text-white font-semibold rounded-lg shadow-sm hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            Add New Patient
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map(patient => (
                          <PatientCard key={patient.id} patient={patient} onSelect={() => handleSelectPatient(patient.id)} />
                        ))
                    ) : (
                        <div className="col-span-full">
                           {searchQuery ? (
                                <div className="text-center py-12">
                                    <p className="text-lg font-semibold text-brand-gray-700">No Patients Found</p>
                                    <p className="text-brand-gray-500 mt-1">No patients match your search query "{searchQuery}".</p>
                                </div>
                            ) : (
                                <EmptyDashboard onAddPatient={() => setAddPatientModalOpen(true)} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>

       <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        message={confirmationState.message}
        variant="danger"
        confirmText="Delete"
      />

       <AddPatientModal 
        isOpen={isAddPatientModalOpen}
        onClose={() => setAddPatientModalOpen(false)}
        onAddPatient={handleAddNewPatient}
      />
      {selectedPatient && (
        <>
            <AddVitalsModal
                isOpen={isAddVitalsModalOpen}
                onClose={() => setAddVitalsModalOpen(false)}
                onAddVitals={handleAddVitals}
            />
            <AddLabResultModal
                isOpen={isAddLabModalOpen}
                onClose={() => setAddLabModalOpen(false)}
                onAddLabResult={handleAddLabResult}
            />
            <AddMedicationModal
                isOpen={isAddMedicationModalOpen}
                onClose={() => setAddMedicationModalOpen(false)}
                onAddMedication={handleAddMedication}
                patientAlerts={selectedPatient.alerts}
            />
            <AddClinicalNoteModal
                isOpen={isAddNoteModalOpen}
                onClose={() => setAddNoteModalOpen(false)}
                onAddClinicalNote={handleAddClinicalNote}
            />
            <AddAlertModal
                isOpen={isAddAlertModalOpen}
                onClose={() => setAddAlertModalOpen(false)}
                onAddAlert={handleAddAlert}
            />
        </>
      )}
      <ExportModal
        isOpen={exportModalState.isOpen}
        onClose={() => setExportModalState({ isOpen: false, target: null })}
        onExport={handleExport}
        target={exportModalState.target === 'all' ? 'all' : patients.find(p => p.id === exportModalState.target)}
      />
    </div>
  );
};

export default App;