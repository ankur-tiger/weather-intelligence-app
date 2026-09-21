import React from 'react';
import { AlertCircle, RefreshCw, Info } from 'lucide-react';
import { AppErrorState } from '../types';

interface ErrorMessageProps {
  error: AppErrorState;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  isRetrying = false,
}) => {
  if (!error.message) return null;

  const isNetwork = error.type === 'network';
  const isEmpty = error.type === 'empty_input';

  if (isEmpty) {
    return (
      <div
        id="empty-input-message"
        role="alert"
        className="w-full max-w-2xl mx-auto my-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 text-sm font-medium animate-fadeIn"
      >
        <Info className="w-5 h-5 text-amber-600 shrink-0" />
        <span className="flex-1">{error.message}</span>
      </div>
    );
  }

  return (
    <div
      id="weather-error-banner"
      role="alert"
      className="w-full max-w-2xl mx-auto my-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
    >
      <div className="flex items-center gap-3 text-rose-800">
        <div className="p-2 bg-rose-100 rounded-xl shrink-0 text-rose-600">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-rose-900 leading-snug">
            {error.message}
          </p>
          {isNetwork && (
            <p className="text-xs text-rose-700 mt-0.5">
              Could not connect to the weather service. Check your internet connection.
            </p>
          )}
        </div>
      </div>

      {isNetwork && onRetry && (
        <button
          id="btn-retry-weather"
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="self-end sm:self-center inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Retry'}
        </button>
      )}
    </div>
  );
};
