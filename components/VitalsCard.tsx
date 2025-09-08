import React from 'react';
import type { Vitals } from '../types';
import Card from './Card';
import { HeartPulseIcon } from './icons';

interface VitalsCardProps {
  vitals: Vitals;
}

const VitalSign: React.FC<{ label: string; value: string | number; unit: string; isAbnormal?: boolean }> = ({ label, value, unit, isAbnormal = false }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-brand-gray-600">{label}</span>
    <span className={`font-bold text-lg ${isAbnormal ? 'text-red-600' : 'text-brand-gray-800'}`}>
      {value} <span className="text-sm font-normal text-brand-gray-500">{unit}</span>
    </span>
  </div>
);

const VitalsCard: React.FC<VitalsCardProps> = ({ vitals }) => {
    const bpSystolic = parseInt(vitals.bloodPressure.split('/')[0]);
    const isBpAbnormal = bpSystolic > 140;

  return (
    <Card title="Vitals" icon={<HeartPulseIcon className="w-6 h-6" />}>
      <div className="space-y-3">
        <VitalSign label="BP" value={vitals.bloodPressure} unit="mmHg" isAbnormal={isBpAbnormal} />
        <VitalSign label="Heart Rate" value={vitals.heartRate} unit="bpm" />
        <VitalSign label="Temp" value={vitals.temperature} unit="°C" />
        <VitalSign label="Resp. Rate" value={vitals.respiratoryRate} unit="breaths/min" />
        <VitalSign label="SpO2" value={vitals.oxygenSaturation} unit="%" />
      </div>
    </Card>
  );
};

export default VitalsCard;
