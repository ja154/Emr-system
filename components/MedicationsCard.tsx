import React from 'react';
import type { Medication } from '../types';
import Card from './Card';
import { PillIcon, PlusIcon, TrashIcon } from './icons';

interface MedicationsCardProps {
  medications: Medication[];
  onAdd: () => void;
  onRemove: (medicationId: string) => void;
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ medications, onAdd, onRemove }) => {
  const addButton = (
    <button onClick={onAdd} className="p-1 rounded-full text-brand-primary-500 hover:bg-brand-primary-100" aria-label="Add new medication">
      <PlusIcon className="w-5 h-5" />
    </button>
  );

  return (
    <Card title="Active Medications" icon={<PillIcon className="w-6 h-6" />} action={addButton}>
      {medications.length > 0 ? (
        <ul className="space-y-2">
            <li className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-3 text-xs font-semibold text-brand-gray-500 uppercase">
                <span className="col-span-1">Name / Dosage</span>
                <span className="text-center">Frequency</span>
                <span className="text-right">Duration</span>
                <span className="sr-only">Actions</span>
            </li>
          {medications.map((med) => (
            <li key={med.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center p-3 rounded-lg hover:bg-brand-gray-50 text-sm border border-transparent hover:border-brand-gray-200">
              <div className="col-span-1">
                <p className="font-semibold text-brand-gray-800">{med.name}</p>
                <p className="text-brand-gray-500">{med.dosage}</p>
              </div>
              <p className="text-brand-gray-600 text-center">{med.frequency}</p>
              <p className="text-brand-gray-600 text-right font-medium">{med.duration}</p>
              <div>
                <button onClick={() => onRemove(med.id)} className="p-1 rounded-full text-brand-gray-400 hover:text-brand-danger-600 hover:bg-brand-danger-100" aria-label={`Remove medication ${med.name}`}>
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-brand-gray-500 py-10">
          No active medications.
        </div>
      )}
    </Card>
  );
};

export default MedicationsCard;