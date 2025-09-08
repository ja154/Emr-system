import React from 'react';
import type { Medication } from '../types';
import Card from './Card';
import { PillIcon } from './icons';

interface MedicationsCardProps {
  medications: Medication[];
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ medications }) => {
  return (
    <Card title="Active Medications" icon={<PillIcon className="w-6 h-6" />}>
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
    </Card>
  );
};

export default MedicationsCard;
