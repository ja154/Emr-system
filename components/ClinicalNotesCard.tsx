import React from 'react';
import type { ClinicalNote } from '../types';
import Card from './Card';
import { ClipboardTextIcon } from './icons';

interface ClinicalNotesCardProps {
  notes: ClinicalNote[];
}

const ClinicalNotesCard: React.FC<ClinicalNotesCardProps> = ({ notes }) => {
  return (
    <Card title="Clinical Notes" icon={<ClipboardTextIcon className="w-6 h-6" />}>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="relative pl-8">
             <div className="absolute left-0 top-1 flex items-center justify-center w-4 h-4 bg-brand-blue rounded-full">
                <div className="w-2 h-2 bg-white rounded-full"></div>
             </div>
             <div className="absolute left-[7px] top-5 h-full border-l-2 border-brand-gray-200"></div>

            <p className="text-sm font-semibold text-brand-gray-800">{note.date} - {note.specialty}</p>
            <p className="text-sm text-brand-gray-500">by {note.author}</p>
            <p className="mt-1 text-sm text-brand-gray-600">{note.contentSnippet}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ClinicalNotesCard;
