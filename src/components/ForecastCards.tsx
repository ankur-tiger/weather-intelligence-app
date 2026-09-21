import React from 'react';
import { CloudRain, CalendarDays } from 'lucide-react';
import { ProcessedDayForecast } from '../types';
import { getWeatherDetails } from '../utils/weatherCodes';

interface ForecastCardsProps {
  days: ProcessedDayForecast[];
}

export const ForecastCards: React.FC<ForecastCardsProps> = ({ days }) => {
  return (
    <section id="forecast-section" aria-label="7-Day Weather Forecast" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            7-Day Forecast
          </h2>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Daily outlook & rain chance
        </span>
      </div>

      <div
        id="forecast-grid"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
      >
        {days.map((day) => {
          const weatherInfo = getWeatherDetails(day.weatherCode);
          const WeatherIcon = weatherInfo.icon;
          const isToday = day.index === 0;

          return (
            <div
              key={day.date}
              id={`forecast-card-${day.date}`}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center justify-between gap-3 ${
                isToday
                  ? 'bg-sky-50/70 border-sky-200 ring-1 ring-sky-300/60 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Day & Date Header */}
              <div className="w-full">
                <span
                  className={`text-sm font-bold block ${
                    isToday ? 'text-sky-700' : 'text-slate-800'
                  }`}
                >
                  {day.dayName}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {day.formattedDate}
                </span>
              </div>

              {/* Weather Icon */}
              <div
                className={`p-3 rounded-xl ${weatherInfo.bgColor} border border-slate-100 flex items-center justify-center my-1`}
              >
                <WeatherIcon className={`w-8 h-8 ${weatherInfo.color}`} />
              </div>

              {/* Description */}
              <p className="text-xs font-semibold text-slate-700 line-clamp-2 min-h-[32px] flex items-center justify-center">
                {day.weatherDescription}
              </p>

              {/* Temperatures: Max / Min */}
              <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {day.tempMax}°
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {day.tempMin}°
                </span>
              </div>

              {/* Rain Probability Pill */}
              <div
                className={`w-full py-1 px-2 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1 ${
                  day.precipProbability >= 60
                    ? 'bg-blue-100 text-blue-800'
                    : day.precipProbability >= 30
                    ? 'bg-sky-50 text-sky-700'
                    : 'bg-slate-50 text-slate-500'
                }`}
                title={`Precipitation probability: ${day.precipProbability}%`}
              >
                <CloudRain className="w-3 h-3 shrink-0" />
                <span>{day.precipProbability}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
