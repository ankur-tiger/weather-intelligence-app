import { useState, useEffect, useCallback } from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import {
  GeocodingResult,
  WeatherIntelligenceData,
  AppErrorState,
} from './types';
import {
  searchCities,
  loadWeatherIntelligence,
  WeatherApiError,
} from './services/weatherApi';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastCards } from './components/ForecastCards';
import { WeatherCharts } from './components/WeatherCharts';
import { Recommendations } from './components/Recommendations';
import { ErrorMessage } from './components/ErrorMessage';

const DEFAULT_CITY = 'Chennai';

export default function App() {
  const [data, setData] = useState<WeatherIntelligenceData | null>(null);
  const [matchedCities, setMatchedCities] = useState<GeocodingResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [error, setError] = useState<AppErrorState>({ type: null, message: '' });
  const [lastQuery, setLastQuery] = useState<string>(DEFAULT_CITY);

  // Load weather for a specific resolved city
  const fetchWeatherForCity = useCallback(
    async (city: GeocodingResult, isRetryAction = false) => {
      if (isRetryAction) {
        setIsRetrying(true);
      } else {
        setIsLoading(true);
      }
      setError({ type: null, message: '' });

      try {
        const intel = await loadWeatherIntelligence(city);
        setData(intel);
        setSelectedCity(city);
      } catch (err: unknown) {
        if (err instanceof WeatherApiError) {
          setError({ type: err.type, message: err.message });
        } else {
          setError({
            type: 'network',
            message: 'Weather service is unavailable right now. Please try again.',
          });
        }
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    },
    []
  );

  // Search cities and immediately load the top match
  const handleSearch = useCallback(
    async (query: string, isRetryAction = false) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setError({
          type: 'empty_input',
          message: 'Please enter a city name.',
        });
        return;
      }

      setLastQuery(trimmed);
      if (isRetryAction) {
        setIsRetrying(true);
      } else {
        setIsLoading(true);
      }
      setError({ type: null, message: '' });

      try {
        const cities = await searchCities(trimmed);
        setMatchedCities(cities);
        if (cities.length > 0) {
          await fetchWeatherForCity(cities[0], isRetryAction);
        }
      } catch (err: unknown) {
        if (err instanceof WeatherApiError) {
          setError({ type: err.type, message: err.message });
        } else {
          setError({
            type: 'network',
            message: 'Weather service is unavailable right now. Please try again.',
          });
        }
        setIsLoading(false);
        setIsRetrying(false);
      }
    },
    [fetchWeatherForCity]
  );

  // Handle click on matched city chip
  const handleSelectCityMatch = useCallback(
    (city: GeocodingResult) => {
      setSelectedCity(city);
      fetchWeatherForCity(city);
    },
    [fetchWeatherForCity]
  );

  // Retry failed action
  const handleRetry = () => {
    if (selectedCity) {
      fetchWeatherForCity(selectedCity, true);
    } else {
      handleSearch(lastQuery || DEFAULT_CITY, true);
    }
  };

  const handleEmptyInputError = () => {
    setError({
      type: 'empty_input',
      message: 'Please enter a city name.',
    });
  };

  // Initial load: fetch default city Chennai
  useEffect(() => {
    handleSearch(DEFAULT_CITY);
  }, [handleSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header
        id="app-header"
        className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-600 rounded-xl text-white shadow-xs">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                Weather Intelligence
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-none">
                Predictive Forecasting & Outdoor Planning
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedCity && (
              <button
                id="btn-refresh-weather"
                type="button"
                onClick={() => fetchWeatherForCity(selectedCity)}
                disabled={isLoading || isRetrying}
                title="Refresh current weather data"
                className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-600' : ''}`}
                />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-semibold border border-sky-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live API</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Search Bar with Multi-match Chips */}
        <SearchBar
          onSearch={(query) => handleSearch(query)}
          isLoading={isLoading}
          matchedCities={matchedCities}
          selectedCity={selectedCity}
          onSelectCityMatch={handleSelectCityMatch}
          onEmptyInputError={handleEmptyInputError}
        />

        {/* Error Display */}
        {error.message && (
          <ErrorMessage
            error={error}
            onRetry={handleRetry}
            isRetrying={isRetrying}
          />
        )}

        {/* Weather Intelligence Dashboard Content */}
        {data && (
          <div
            id="weather-dashboard-container"
            className="space-y-6 animate-fadeIn"
          >
            {/* Current Weather Card */}
            <CurrentWeather
              city={data.city}
              current={data.current}
              timezone={data.timezone}
            />

            {/* Rule-based Planning Recommendations & Best Day Highlight */}
            <Recommendations
              recommendations={data.recommendations}
              bestOutdoorDay={data.bestOutdoorDay}
            />

            {/* 7-Day Forecast Cards */}
            <ForecastCards days={data.daily} />

            {/* Meteorological Recharts: Temperature Line Chart & Precipitation Bar Chart */}
            <WeatherCharts days={data.daily} />
          </div>
        )}

        {/* Initial Empty / Loading Skeleton if no data yet and no error */}
        {!data && !error.message && isLoading && (
          <div
            id="loading-skeleton"
            className="w-full max-w-2xl mx-auto p-12 text-center text-slate-400 space-y-3"
          >
            <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">
              Fetching meteorological intelligence for {lastQuery}...
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        id="app-footer"
        className="w-full bg-white border-t border-slate-200 mt-auto py-5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Weather data by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-sky-600 hover:text-sky-700 font-semibold underline underline-offset-2"
            >
              Open-Meteo.com
            </a>
            <span>(Free, open-source weather API)</span>
          </div>

          <div className="text-slate-400">
            Rule-based outdoor intelligence • Cloudflare Pages ready
          </div>
        </div>
      </footer>
    </div>
  );
}
