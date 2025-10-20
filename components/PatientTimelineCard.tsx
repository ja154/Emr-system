import React, { useMemo } from 'react';
import type { TimelineEvent, TimelineEventType } from '../types';
import Card from './Card';
import { HistoryIcon, HomeIcon, ScissorsIcon, FileTextIcon, PillIcon, BeakerIcon, LogInIcon } from './icons';

interface PatientTimelineCardProps {
  timeline: TimelineEvent[];
}

const getEventIcon = (eventType: TimelineEventType) => {
  const iconProps = { className: "w-4 h-4 text-white" };
  switch (eventType) {
    case 'Admission':
      return <LogInIcon {...iconProps} />;
    case 'Discharge':
      return <HomeIcon {...iconProps} />;
    case 'Diagnosis':
      return <FileTextIcon {...iconProps} />;
    case 'Surgery':
      return <ScissorsIcon {...iconProps} />;
    case 'Medication':
      return <PillIcon {...iconProps} />;
    case 'Lab':
      return <BeakerIcon {...iconProps} />;
    default:
      return null;
  }
};

const getEventColor = (eventType: TimelineEventType) => {
    switch(eventType) {
        case 'Admission': return 'bg-blue-500';
        case 'Diagnosis': return 'bg-purple-500';
        case 'Surgery': return 'bg-red-500';
        case 'Discharge': return 'bg-green-500';
        case 'Medication': return 'bg-yellow-500';
        case 'Lab': return 'bg-teal-500';
        default: return 'bg-brand-gray-500';
    }
}


const PatientTimelineCard: React.FC<PatientTimelineCardProps> = ({ timeline }) => {
  const sortedTimeline = useMemo(() => {
    if (!timeline) return [];
    return [...timeline].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [timeline]);

  return (
    <Card title="Patient Timeline" icon={<HistoryIcon className="w-6 h-6" />}>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3">
        {sortedTimeline.length > 0 ? (
          sortedTimeline.map((event, index) => (
            <div key={event.id} className="relative pl-10 group">
              {/* Timeline line */}
              {index < sortedTimeline.length - 1 && (
                <div className="absolute left-4 top-5 h-full border-l-2 border-brand-gray-200"></div>
              )}
              {/* Timeline dot/icon */}
              <div className={`absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(event.eventType)}`}>
                {getEventIcon(event.eventType)}
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-brand-gray-800">{event.title}</p>
                    <p className="text-xs text-brand-gray-500 mb-1">
                        {new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        <span className="font-semibold mx-1.5">&middot;</span>
                        {event.eventType}
                    </p>
                    <p className="text-sm text-brand-gray-600">{event.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
           <div className="text-center text-brand-gray-500 py-10">
             No timeline events recorded.
           </div>
        )}
      </div>
    </Card>
  );
};

export default PatientTimelineCard;
