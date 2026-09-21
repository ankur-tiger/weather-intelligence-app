import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  Calendar,
} from 'lucide-react';
import { GeocodingResult, CurrentWeatherData } from '../types';
import { getWeatherDetails, formatDateTime } from '../utils/weatherCodes';

interface CurrentWeatherProps {
  city: GeocodingResult;
  current: CurrentWeatherData;
  timezone: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  city,
  current,
  timezone,
}) => {
  const weatherInfo = getWeatherDetails(current.weather_code);
  const WeatherIcon = weatherInfo.icon;
  const formattedTime = formatDateTime(current.time, timezone);

  const locationTitle = city.name;
  const locationSub = [city.admin1, city.country].filter(Boolean).join(', ');

  return (
    <section
      id="current-weather-card"
      aria-label="Current Weather"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 md:p-8 relative overflow-hidden"
    >
      {/* Background soft ambient tint */}
      <div
        className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-100/50 via-sky-50/20 to-transparent rounded-bl-full pointer-events-none -z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header: Location & Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-sky-700 font-semibold text-xs tracking-wide uppercase">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Current Weather</span>
            </div>
            <h1
              id="current-city-name"
              className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900"
            >
              {locationTitle}
            </h1>
            {locationSub && (
              <p
                id="current-city-region"
                className="text-sm font-medium text-slate-500"
              >
                {locationSub}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 self-start sm:self-center">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span id="current-local-time" className="font-medium text-slate-700">
              {formattedTime}
            </span>
            <span className="text-slate-400">({timezone.replace('_', ' ')})</span>
          </div>
        </div>

        {/* Primary weather metrics row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Temperature & Weather Icon */}
          <div className="lg:col-span-5 flex items-center gap-5">
            <div
              className={`p-4 md:p-5 rounded-2xl ${weatherInfo.bgColor} border border-slate-100/80 shadow-xs flex items-center justify-center`}
            >
              <WeatherIcon className={`w-14 h-14 md:w-16 md:h-16 ${weatherInfo.color}`} />
            </div>

            <div>
              <div className="flex items-baseline">
                <span
                  id="current-temp"
                  className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900"
                >
                  {Math.round(current.temperature_2m)}
                </span>
                <span className="text-2xl md:text-3xl font-semibold text-slate-500 ml-1">
                  °C
                </span>
              </div>
              <p
                id="current-weather-desc"
                className="text-base font-semibold text-slate-700 mt-1 capitalize"
              >
                {weatherInfo.description}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Feels like{' '}
                <span id="current-feels-like" className="font-semibold text-slate-700">
                  {Math.round(current.apparent_temperature)}°C
                </span>
              </p>
            </div>
          </div>

          {/* Meteorological Metrics Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Feels-like */}
            <div
              id="metric-feels-like"
              className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium">Feels Like</span>
              </div>
              <span className="text-lg font-bold text-slate-900">
                {Math.round(current.apparent_temperature)}°C
              </span>
            </div>

            {/* Relative Humidity */}
            <div
              id="metric-humidity"
              className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Droplets className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-medium">Humidity</span>
              </div>
              <span className="text-lg font-bold text-slate-900">
                {current.relative_humidity_2m}%
              </span>
            </div>

            {/* Wind Speed */}
            <div
              id="metric-wind"
              className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Wind className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-medium">Wind Speed</span>
              </div>
              <span className="text-lg font-bold text-slate-900">
                {Math.round(current.wind_speed_10m)}{' '}
                <span className="text-xs font-normal text-slate-500">km/h</span>
              </span>
            </div>

            {/* Precipitation */}
            <div
              id="metric-precip"
              className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-100 flex flex-col justify-between col-span-2 sm:col-span-3"
            >
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium">Current Precipitation</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900">
                  {Number(current.precipitation.toFixed(1))} mm
                </span>
                <span className="text-xs text-slate-500">
                  {current.precipitation > 0 ? 'Active precipitation observed' : 'No active rain'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
