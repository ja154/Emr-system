import React from 'react';
import Card from './Card';
import { AlertTriangleIcon, PlusIcon, XIcon } from './icons';

interface AlertsCardProps {
  alerts: string[];
  onAdd: () => void;
  onRemove: (alert: string) => void;
}

const AlertsCard: React.FC<AlertsCardProps> = ({ alerts, onAdd, onRemove }) => {
  const addButton = (
    <button onClick={onAdd} className="p-1 rounded-full text-brand-blue hover:bg-brand-blue-light" aria-label="Add new alert">
      <PlusIcon className="w-5 h-5" />
    </button>
  );

  return (
    <Card title="Patient Alerts" icon={<AlertTriangleIcon className="w-6 h-6 text-red-600" />} action={addButton}>
       {alerts.length > 0 ? (
        <div className="flex flex-wrap gap-2 max-h-[320px] overflow-y-auto">
          {alerts.map((alert, index) => (
            <span key={index} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
                {alert}
                <button 
                    onClick={() => onRemove(alert)} 
                    className="p-0.5 rounded-full hover:bg-red-200"
                    aria-label={`Remove alert: ${alert}`}
                >
                    <XIcon className="w-3 h-3"/>
                </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center text-brand-gray-500 py-10">
          No active alerts for this patient.
        </div>
      )}
    </Card>
  );
};

export default AlertsCard;
