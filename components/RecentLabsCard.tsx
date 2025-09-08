import React from 'react';
import type { LabResult } from '../types';
import Card from './Card';
import { BeakerIcon } from './icons';

interface RecentLabsCardProps {
  labs: LabResult[];
}

const getStatusColor = (status: LabResult['status']) => {
    switch (status) {
        case 'Abnormal': return 'bg-yellow-100 text-yellow-800';
        case 'Critical': return 'bg-red-100 text-red-800';
        default: return 'bg-green-100 text-green-800';
    }
}

const RecentLabsCard: React.FC<RecentLabsCardProps> = ({ labs }) => {
  return (
    <Card title="Recent Lab Results" icon={<BeakerIcon className="w-6 h-6" />}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-gray-600">
          <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">Test Name</th>
              <th scope="col" className="px-4 py-3">Result</th>
              <th scope="col" className="px-4 py-3 hidden sm:table-cell">Reference Range</th>
              <th scope="col" className="px-4 py-3 hidden md:table-cell">Date</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab.id} className="bg-white border-b hover:bg-brand-gray-50">
                <td className="px-4 py-3 font-medium text-brand-gray-900 whitespace-nowrap">{lab.testName}</td>
                <td className={`px-4 py-3 font-semibold ${lab.status !== 'Normal' ? 'text-red-600' : 'text-brand-gray-800'}`}>{lab.result}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{lab.referenceRange}</td>
                <td className="px-4 py-3 hidden md:table-cell">{lab.date}</td>
                <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lab.status)}`}>
                        {lab.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentLabsCard;
