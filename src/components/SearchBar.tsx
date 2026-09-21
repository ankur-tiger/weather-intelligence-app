import React, { useState } from 'react';
import { Search, Loader2, MapPin, Check } from 'lucide-react';
import { GeocodingResult } from '../types';

interface SearchBarProps {
  onSearch: (cityQuery: string) => void;
  isLoading: boolean;
  matchedCities?: GeocodingResult[];
  selectedCity?: GeocodingResult | null;
  onSelectCityMatch: (city: GeocodingResult) => void;
  onEmptyInputError: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  matchedCities = [],
  selectedCity = null,
  onSelectCityMatch,
  onEmptyInputError,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      onEmptyInputError();
      return;
    }
    onSearch(trimmed);
  };

  const getCityLabel = (city: GeocodingResult): string => {
    const parts = [city.name];
    if (city.admin1 && city.admin1 !== city.name) {
      parts.push(city.admin1);
    }
    if (city.country) {
      parts.push(city.country);
    }
    return parts.join(', ');
  };

  return (
    <div id="search-section" className="w-full max-w-2xl mx-auto space-y-3">
      <form
        id="search-form"
        onSubmit={handleSubmit}
        className="relative flex items-center shadow-xs rounded-2xl bg-white border border-slate-200 transition-all focus-within:border-sky-500 focus-within:ring-3 focus-within:ring-sky-100"
      >
        <div className="pl-4 pr-2 text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city (e.g., Chennai, Tokyo, Paris, New York)..."
          disabled={isLoading}
          autoComplete="off"
          className="w-full py-3.5 pr-3 text-slate-800 placeholder-slate-400 bg-transparent text-sm md:text-base outline-none disabled:opacity-50"
        />

        <button
          id="search-submit-btn"
          type="submit"
          disabled={isLoading}
          className="mr-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Searching</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {/* Multiple City Matches Chips (Feature 9) */}
      {matchedCities.length > 1 && (
        <div id="city-matches-container" className="pt-1">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Multiple matches found — select your location:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedCities.map((city) => {
              const isSelected = selectedCity?.id === city.id;
              return (
                <button
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  id={`city-chip-${city.id}`}
                  type="button"
                  onClick={() => onSelectCityMatch(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs ring-2 ring-sky-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                  <span>{getCityLabel(city)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
