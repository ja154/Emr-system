import React from 'react';
import type { Vitals } from '../types';
import Card from './Card';
import { HeartPulseIcon, PlusIcon } from './icons';

interface VitalsCardProps {
  vitals: Vitals[];
  onAdd: () => void;
}

const VitalSign: React.FC<{ label: string; value: string | number; unit: string; isAbnormal?: boolean }> = ({ label, value, unit, isAbnormal = false }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-brand-gray-600">{label}</span>
    <span className={`font-bold text-lg ${isAbnormal ? 'text-red-600' : 'text-brand-gray-800'}`}>
      {value} <span className="text-sm font-normal text-brand-gray-500">{unit}</span>
    </span>
  </div>
);

const VitalsCard: React.FC<VitalsCardProps> = ({ vitals, onAdd }) => {
  const latestVitals = vitals.length > 0 
    ? [...vitals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] 
    : null;

  const bpSystolic = latestVitals ? parseInt(latestVitals.bloodPressure.split('/')[0]) : 0;
  const isBpAbnormal = bpSystolic > 140;

  const addButton = (
    <button onClick={onAdd} className="p-1 rounded-full text-brand-blue hover:bg-brand-blue-light" aria-label="Add new vitals reading">
      <PlusIcon className="w-5 h-5" />
    </button>
  );

  return (
    <Card title="Vitals" icon={<HeartPulseIcon className="w-6 h-6" />} action={addButton}>
      {latestVitals ? (
        <div className="space-y-3">
          <VitalSign label="BP" value={latestVitals.bloodPressure} unit="mmHg" isAbnormal={isBpAbnormal} />
          <VitalSign label="Heart Rate" value={latestVitals.heartRate} unit="bpm" />
          <VitalSign label="Temp" value={latestVitals.temperature} unit="°C" />
          <VitalSign label="Resp. Rate" value={latestVitals.respiratoryRate} unit="breaths/min" />
          <VitalSign label="SpO2" value={latestVitals.oxygenSaturation} unit="%" />
          <p className="text-xs text-brand-gray-400 pt-2 text-right">
            Last updated: {new Date(latestVitals.date).toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="text-center text-brand-gray-500">
          No vitals recorded.
        </div>
      )}
    </Card>
  );
};

export default VitalsCard;
