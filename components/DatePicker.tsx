import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  id?: string;
  name?: string;
  inputClassName?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, id, name, inputClassName, ...ariaProps }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set view to current value if it changes externally
    setViewDate(value ? new Date(value + 'T00:00:00') : new Date());
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [datePickerRef]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(selectedDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const changeMonth = (offset: number) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const calendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = firstDayOfMonth(year, month);
    const totalDays = daysInMonth(year, month);
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    return [...blanks, ...days];
  };
  
  const today = new Date();
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  return (
    <div className="relative" ref={datePickerRef}>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onFocus={() => setIsOpen(true)}
          readOnly
          className={`cursor-pointer ${inputClassName || ''}`}
          placeholder="YYYY-MM-DD"
          {...ariaProps}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <CalendarIcon className="h-5 w-5 text-brand-gray-400" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-72 bg-white border border-brand-gray-300 rounded-lg shadow-lg p-2">
          <div className="flex justify-between items-center mb-2">
            <button type="button" onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-brand-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
            <span className="font-semibold text-sm">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button type="button" onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-brand-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-brand-gray-500">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-1">
            {calendarDays().map((day, index) => (
              <div key={index} className="text-center">
                {day ? (
                  <button
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center
                      ${!selectedDate && today.getDate() === day && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear() ? 'text-brand-blue font-bold' : ''}
                      ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === viewDate.getMonth() && selectedDate.getFullYear() === viewDate.getFullYear() ? 'bg-brand-blue text-white' : 'hover:bg-brand-gray-100'}
                    `}
                  >
                    {day}
                  </button>
                ) : <div />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
