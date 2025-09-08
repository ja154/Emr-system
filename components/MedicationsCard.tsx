import React from 'react';
import type { Medication } from '../types';
import Card from './Card';
import { PillIcon, PlusIcon } from './icons';

interface MedicationsCardProps {
  medications: Medication[];
  onAdd: () => void;
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ medications, onAdd }) => {
  const addButton = (
    <button onClick={onAdd} className="p-1 rounded-full text-brand-blue hover:bg-brand-blue-light" aria-label="Add new medication">
      <PlusIcon className="w-5 h-5" />
    </button>
  );

  return (
    <Card title="Active Medications" icon={<PillIcon className="w-6 h-6" />} action={addButton}>
      {medications.length > 0 ? (
        <ul className="space-y-3">
          {medications.map((med) => (
            <li key={med.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-2 rounded-md hover:bg-brand-gray-50">
              <div>
                <p className="font-semibold text-brand-gray-800">{med.name}</p>
                <p className="text-sm text-brand-gray-500">{med.dosage}</p>
              </div>
              <p className="text-sm text-brand-gray-600 mt-1 sm:mt-0">{med.frequency}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-brand-gray-500">
          No active medications.
        </div>
      )}
    </Card>
  );
};

export default MedicationsCard;
