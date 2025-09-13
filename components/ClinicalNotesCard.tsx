import React from 'react';
import type { ClinicalNote } from '../types';
import Card from './Card';
import { ClipboardTextIcon, PlusIcon, TrashIcon } from './icons';

interface ClinicalNotesCardProps {
  notes: ClinicalNote[];
  onAdd: () => void;
  onRemove: (noteId: string) => void;
}

const ClinicalNotesCard: React.FC<ClinicalNotesCardProps> = ({ notes, onAdd, onRemove }) => {
  const addButton = (
    <button onClick={onAdd} className="p-1 rounded-full text-brand-blue hover:bg-brand-blue-light" aria-label="Add new clinical note">
      <PlusIcon className="w-5 h-5" />
    </button>
  );
  
  return (
    <Card title="Clinical Notes" icon={<ClipboardTextIcon className="w-6 h-6" />} action={addButton}>
      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="relative pl-8 group">
              <div className="absolute left-0 top-1 flex items-center justify-center w-4 h-4 bg-brand-blue rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute left-[7px] top-5 h-full border-l-2 border-brand-gray-200"></div>
              <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-brand-gray-800">{note.date} - {note.specialty}</p>
                    <p className="text-sm text-brand-gray-500">by {note.author}</p>
                    <p className="mt-1 text-sm text-brand-gray-600">{note.contentSnippet}</p>
                </div>
                <button 
                  onClick={() => onRemove(note.id)} 
                  className="p-1 rounded-full text-brand-gray-400 hover:text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove note from ${note.date}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
           <div className="text-center text-brand-gray-500">
             No clinical notes recorded.
           </div>
        )}
      </div>
    </Card>
  );
};

export default ClinicalNotesCard;
