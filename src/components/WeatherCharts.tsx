import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { ProcessedDayForecast } from '../types';

interface WeatherChartsProps {
  days: ProcessedDayForecast[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const TemperatureTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
        <p className="font-bold text-slate-800 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
              <span className="font-medium text-slate-600">{entry.name}:</span>
            </span>
            <span className="font-bold text-slate-900">{entry.value}°C</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PrecipitationTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
        <p className="font-bold text-slate-800 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-2 h-2 rounded-full inline-block bg-blue-500" />
              <span className="font-medium text-slate-600">{entry.name}:</span>
            </span>
            <span className="font-bold text-slate-900">{entry.value} mm</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ days }) => {
  const chartData = days.map((d) => ({
    name: d.dayName,
    date: d.formattedDate,
    maxTemp: d.tempMax,
    minTemp: d.tempMin,
    precipitation: d.precipitationSum,
    probability: d.precipProbability,
  }));

  return (
    <section id="weather-charts-section" aria-label="Weather Intelligence Charts" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Trends & Analysis
          </h2>
        </div>
        <span className="text-xs font-medium text-slate-500">
          7-day meteorological patterns
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Daily Max/Min Temperature */}
        <div
          id="temperature-chart-card"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="text-sm font-bold text-slate-800">
                Daily Temperature Range (°C)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Max & Min</span>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  unit="°"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<TemperatureTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="maxTemp"
                  name="Max Temp"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ea580c', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#ea580c' }}
                />
                <Line
                  type="monotone"
                  dataKey="minTemp"
                  name="Min Temp"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0284c7', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#0284c7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Daily Precipitation */}
        <div
          id="precipitation-chart-card"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800">
                Daily Expected Precipitation (mm)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Total volume</span>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  unit=" mm"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={[0, 'auto']}
                />
                <Tooltip content={<PrecipitationTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="rect"
                />
                <Bar
                  dataKey="precipitation"
                  name="Precipitation"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
