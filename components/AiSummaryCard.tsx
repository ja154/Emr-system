import React, { useState, useCallback, useEffect } from 'react';
import type { AiSummary } from '../types';
import { generateClinicalSummary } from '../services/geminiService';
import Card from './Card';
import { SparklesIcon, LightbulbIcon, CheckCircleIcon, AlertCircleIcon } from './icons';

interface AiSummaryCardProps {
  patientData: object;
}

const LOADING_MESSAGES = [
    "Connecting to AI service...",
    "Analyzing vitals and lab results...",
    "Reviewing historical clinical notes...",
    "Checking for medication interactions...",
    "Compiling final clinical summary...",
    "Almost there, finalizing insights...",
];

const AiSummaryCard: React.FC<AiSummaryCardProps> = ({ patientData }) => {
  const [summary, setSummary] = useState<AiSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isLoading) {
      setLoadingMessage(LOADING_MESSAGES[0]); // Reset to first message on start
      let messageIndex = 0;
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 2000); // Change message every 2 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

  const handleGenerateSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await generateClinicalSummary(patientData);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [patientData]);

  return (
    <Card title="AI Clinical Summary" icon={<SparklesIcon className="w-6 h-6" />}>
        {!summary && !isLoading && !error && (
            <div className="text-center flex flex-col items-center justify-center h-full">
                <div className="bg-brand-blue-light text-brand-blue-dark rounded-full p-4">
                    <SparklesIcon className="w-10 h-10" />
                </div>
                <p className="mt-4 text-brand-gray-600">Get an AI-powered summary of this patient's chart to quickly identify key issues.</p>
            </div>
        )}
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
                <svg className="animate-spin h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-brand-gray-600 text-center">{loadingMessage}</p>
            </div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-red-50 rounded-lg">
                <AlertCircleIcon className="w-10 h-10 text-red-500" />
                <p className="mt-2 font-semibold text-red-700">Failed to generate summary</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
        )}
      
        {summary && (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-brand-gray-700">Summary</h3>
                    <p className="mt-1 text-sm text-brand-gray-600">{summary.summary}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-brand-gray-700 flex items-center gap-2">
                        <LightbulbIcon className="w-5 h-5 text-yellow-500" />
                        Key Concerns
                    </h3>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-brand-gray-600">
                        {summary.keyConcerns.map((concern, index) => <li key={index}>{concern}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-brand-gray-700 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-brand-green" />
                        Suggested Actions
                    </h3>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-brand-gray-600">
                        {summary.suggestedActions.map((action, index) => <li key={index}>{action}</li>)}
                    </ul>
                </div>
            </div>
        )}

       <div className="mt-6 pt-4 border-t border-brand-gray-200">
         <button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-sm hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-brand-gray-300 disabled:cursor-not-allowed transition-colors"
            >
            <SparklesIcon className="w-5 h-5" />
            {isLoading ? 'Generating...' : (summary ? 'Regenerate Summary' : 'Generate Summary')}
        </button>
       </div>
    </Card>
  );
};

export default AiSummaryCard;