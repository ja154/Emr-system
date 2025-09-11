import React from 'react';
import type { Vitals } from '../types';
import Card from './Card';
import { HeartPulseIcon, PlusIcon } from './icons';

interface VitalsCardProps {
  vitals: Vitals[];
  onAdd: () => void;
}

// A compact version of the VitalSign display for the history list
const VitalSignCompact: React.FC<{ label: string; value: string | number; unit: string; isAbnormal?: boolean }> = ({ label, value, unit, isAbnormal = false }) => (
  <div className="flex justify-between items-baseline text-sm">
    <span className="text-brand-gray-600">{label}</span>
    <span className={`font-semibold ${isAbnormal ? 'text-red-600' : 'text-brand-gray-800'}`}>
      {value} <span className="text-xs font-normal text-brand-gray-500">{unit}</span>
    </span>
  </div>
);

const VitalsCard: React.FC<VitalsCardProps> = ({ vitals, onAdd }) => {
  // Assuming vitals are pre-sorted with newest first. Take the last 5.
  const recentVitals = vitals.slice(0, 5);

  const addButton = (
    <button onClick={onAdd} className="p-1 rounded-full text-brand-blue hover:bg-brand-blue-light" aria-label="Add new vitals reading">
      <PlusIcon className="w-5 h-5" />
    </button>
  );

  return (
    <Card title="Vitals History (Last 5)" icon={<HeartPulseIcon className="w-6 h-6" />} action={addButton}>
      {recentVitals.length > 0 ? (
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
          {recentVitals.map((vital, index) => {
            const bpSystolic = parseInt(vital.bloodPressure.split('/')[0]);
            const isBpAbnormal = bpSystolic > 140 || bpSystolic < 90;
            return (
              <div key={index} className="p-3 rounded-lg bg-brand-gray-50 border border-brand-gray-200">
                <p className="text-xs font-semibold text-brand-gray-700 mb-2 pb-2 border-b border-brand-gray-200">
                  {new Date(vital.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <div className="space-y-1.5">
                  <VitalSignCompact label="BP" value={vital.bloodPressure} unit="mmHg" isAbnormal={isBpAbnormal} />
                  <VitalSignCompact label="Heart Rate" value={vital.heartRate} unit="bpm" />
                  <VitalSignCompact label="Temp" value={vital.temperature} unit="°C" />
                  <VitalSignCompact label="Resp. Rate" value={vital.respiratoryRate} unit="breaths/min" />
                  <VitalSignCompact label="SpO2" value={vital.oxygenSaturation} unit="%" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-brand-gray-500 py-10">
          No vitals recorded.
        </div>
      )}
    </Card>
  );
};

export default VitalsCard;