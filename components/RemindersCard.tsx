import React, { useMemo } from 'react';
import type { Reminder } from '../types';
import Card from './Card';
import { BellIcon, PlusIcon, CheckCircleIcon, TrashIcon } from './icons';

interface RemindersCardProps {
  reminders: Reminder[];
  onAdd: () => void;
  onRemove: (reminderId: string) => void;
  onToggleStatus: (reminderId: string) => void;
}

const RemindersCard: React.FC<RemindersCardProps> = ({ reminders, onAdd, onRemove, onToggleStatus }) => {
  const addButton = (
    <button onClick={onAdd} className="p-1 rounded-full text-brand-blue hover:bg-brand-blue-light" aria-label="Add new reminder">
      <PlusIcon className="w-5 h-5" />
    </button>
  );

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      // Completed items go to the bottom
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      // Then sort by due date (ascending)
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [reminders]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card title="Patient Reminders" icon={<BellIcon className="w-6 h-6" />} action={addButton}>
      {sortedReminders.length > 0 ? (
        <ul className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
          {sortedReminders.map(reminder => {
            const isCompleted = reminder.status === 'completed';
            const dueDate = new Date(reminder.dueDate + 'T00:00:00');
            const isOverdue = !isCompleted && dueDate < today;

            return (
              <li key={reminder.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-gray-50 transition-colors">
                <button
                  onClick={() => onToggleStatus(reminder.id)}
                  aria-label={isCompleted ? `Mark '${reminder.title}' as pending` : `Mark '${reminder.title}' as complete`}
                >
                  <CheckCircleIcon 
                    className={`w-6 h-6 transition-colors ${
                      isCompleted 
                        ? 'text-brand-green' 
                        : 'text-brand-gray-300 hover:text-brand-gray-400'
                    }`}
                    fill={isCompleted ? 'currentColor' : 'none'}
                  />
                </button>
                <div className="flex-grow">
                  <p className={`font-medium text-brand-gray-800 ${isCompleted ? 'line-through text-brand-gray-500' : ''}`}>
                    {reminder.title}
                  </p>
                  <p className={`text-sm ${
                    isCompleted 
                      ? 'text-brand-gray-400' 
                      : isOverdue 
                      ? 'text-red-600 font-semibold' 
                      : 'text-brand-gray-500'
                  }`}>
                    Due: {dueDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    {isOverdue && ' (Overdue)'}
                  </p>
                </div>
                <button onClick={() => onRemove(reminder.id)} className="p-1 rounded-full text-brand-gray-400 hover:text-red-600 hover:bg-red-100" aria-label={`Remove reminder: ${reminder.title}`}>
                  <TrashIcon className="w-4 h-4" />
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="text-center text-brand-gray-500 py-10">
          No reminders for this patient.
        </div>
      )}
    </Card>
  );
};

export default RemindersCard;