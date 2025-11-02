import React, { useState, useMemo } from 'react';
import type { LabResult } from '../types';
import Card from './Card';
import { BeakerIcon, PlusIcon, ArrowUpDownIcon, TrashIcon } from './icons';

interface RecentLabsCardProps {
  labs: LabResult[];
  onAdd: () => void;
  onRemove: (labId: string) => void;
}

const getStatusColor = (status: LabResult['status']) => {
    switch (status) {
        case 'Abnormal': return 'bg-brand-warning-100 text-brand-warning-800';
        case 'Critical': return 'bg-brand-danger-100 text-brand-danger-800';
        default: return 'bg-brand-success-100 text-brand-success-800';
    }
}

const RecentLabsCard: React.FC<RecentLabsCardProps> = ({ labs, onAdd, onRemove }) => {
  const [sortOrder, setSortOrder] = useState<'date' | 'status'>('date');

  const sortedLabs = useMemo(() => {
    const statusPriority = {
      'Critical': 0,
      'Abnormal': 1,
      'Normal': 2,
    };

    return [...labs].sort((a, b) => {
      if (sortOrder === 'status') {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      // Default to date sort (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [labs, sortOrder]);

  const SortButton: React.FC<{ sortKey: 'date' | 'status', label: string }> = ({ sortKey, label }) => {
    const isActive = sortOrder === sortKey;
    return (
      <button
        onClick={() => setSortOrder(sortKey)}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
          isActive ? 'bg-brand-primary-500 text-white shadow-sm' : 'text-brand-gray-600 hover:bg-brand-gray-100'
        }`}
        aria-pressed={isActive}
      >
        {label}
      </button>
    );
  };
  
  const cardActions = (
    <div className="flex items-center gap-2">
       <div className="flex items-center gap-1.5 text-sm text-brand-gray-600 mr-2">
            <ArrowUpDownIcon className="w-4 h-4" />
            <span className="font-medium text-xs">Sort by:</span>
        </div>
      <div className="flex items-center gap-1 bg-brand-gray-100 p-0.5 rounded-lg">
        <SortButton sortKey="date" label="Date" />
        <SortButton sortKey="status" label="Status" />
      </div>
      <div className="h-6 w-px bg-brand-gray-200 mx-1"></div>
      <button onClick={onAdd} className="p-1 rounded-full text-brand-primary-500 hover:bg-brand-primary-100" aria-label="Add new lab result">
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <Card title="Recent Lab Results" icon={<BeakerIcon className="w-6 h-6" />} action={cardActions}>
      <div className="overflow-x-auto">
        {sortedLabs.length > 0 ? (
          <table className="w-full text-sm text-left text-brand-gray-600">
            <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Test Name</th>
                <th scope="col" className="px-4 py-3">Result</th>
                <th scope="col" className="px-4 py-3 hidden sm:table-cell">Reference Range</th>
                <th scope="col" className="px-4 py-3 hidden md:table-cell">Date</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {sortedLabs.map((lab) => (
                <tr key={lab.id} className="bg-white border-b hover:bg-brand-gray-50">
                  <td className="px-4 py-3 font-medium text-brand-gray-900 whitespace-nowrap">{lab.testName}</td>
                  <td className={`px-4 py-3 font-semibold ${lab.status !== 'Normal' ? 'text-brand-danger-600' : 'text-brand-gray-800'}`}>{lab.result}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{lab.referenceRange}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{new Date(lab.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lab.status)}`}>
                          {lab.status}
                      </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onRemove(lab.id)} className="p-1 rounded-full text-brand-gray-400 hover:text-brand-danger-600 hover:bg-brand-danger-100" aria-label={`Remove lab result for ${lab.testName}`}>
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-brand-gray-500 py-10">
            No lab results recorded.
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentLabsCard;