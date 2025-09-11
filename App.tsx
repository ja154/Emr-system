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
import { StethoscopeIcon, UserPlusIcon, ChevronRightIcon, SearchIcon, LayoutGridIcon, BeakerIcon, PillIcon, ClipboardTextIcon } from './components/icons';

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

  const handleRemoveAlert = (alertToRemove: string) => {
    if (!selectedPatientId) return;
    const currentPatient = patients.find(p => p.id === selectedPatientId);
    if (currentPatient) {
        updatePatientData(selectedPatientId, { alerts: currentPatient.alerts.filter(a => a !== alertToRemove) });
    }
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
                <PatientHeader patient={selectedPatient} onBack={handleBackToDashboard} />
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
                                        <AlertsCard alerts={selectedPatient.alerts} onAdd={() => setAddAlertModalOpen(true)} onRemove={handleRemoveAlert}/>
                                    </div>
                                )}
                                {activeTab === 'labs' && <div role="tabpanel"><RecentLabsCard labs={selectedPatient.labs} onAdd={() => setAddLabModalOpen(true)} /></div>}
                                {activeTab === 'medications' && <div role="tabpanel"><MedicationsCard medications={selectedPatient.medications} onAdd={() => setAddMedicationModalOpen(true)} /></div>}
                                {activeTab === 'notes' && <div role="tabpanel"><ClinicalNotesCard notes={selectedPatient.notes} onAdd={() => setAddNoteModalOpen(true)} /></div>}
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
                        <div className="col-span-full text-center py-12">
                            <p className="text-lg font-semibold text-brand-gray-700">No Patients Found</p>
                            <p className="text-brand-gray-500 mt-1">No patients match your search query "{searchQuery}".</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>

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
    </div>
  );
};

export default App;