import React from 'react';
import {
  Umbrella,
  Flame,
  Snowflake,
  Wind,
  Sun,
  CheckCircle2,
  Sparkles,
  Compass,
} from 'lucide-react';
import { RecommendationAlert, BestOutdoorDayInfo } from '../types';

interface RecommendationsProps {
  recommendations: RecommendationAlert[];
  bestOutdoorDay: BestOutdoorDayInfo | null;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  bestOutdoorDay,
}) => {
  const getAlertIcon = (type: RecommendationAlert['type']) => {
    switch (type) {
      case 'rain':
        return Umbrella;
      case 'heat':
        return Flame;
      case 'cold':
        return Snowflake;
      case 'wind':
        return Wind;
      case 'uv':
        return Sun;
      default:
        return CheckCircle2;
    }
  };

  const getAlertBadgeStyle = (level: RecommendationAlert['level']) => {
    switch (level) {
      case 'alert':
        return {
          container: 'bg-rose-50/80 border-rose-200 text-rose-900',
          iconBg: 'bg-rose-100 text-rose-600',
          tag: 'bg-rose-600 text-white',
        };
      case 'warning':
        return {
          container: 'bg-amber-50/80 border-amber-200 text-amber-900',
          iconBg: 'bg-amber-100 text-amber-700',
          tag: 'bg-amber-500 text-white',
        };
      case 'favorable':
        return {
          container: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
          iconBg: 'bg-emerald-100 text-emerald-700',
          tag: 'bg-emerald-600 text-white',
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50/80 border-blue-200 text-blue-900',
          iconBg: 'bg-blue-100 text-blue-600',
          tag: 'bg-blue-500 text-white',
        };
    }
  };

  return (
    <section
      id="recommendations-section"
      aria-label="Planning Recommendations"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Planning & Recommendations
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          Rule-Based
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Highlight: Best Day for Outdoor Activity */}
        {bestOutdoorDay && (
          <div
            id="best-outdoor-day-card"
            className="lg:col-span-5 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden"
          >
            {/* Subtle decorative circle */}
            <div
              className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full pointer-events-none"
              aria-hidden="true"
            />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider text-emerald-50">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Best Day for Outdoor Plans</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold tracking-tight">
                  {bestOutdoorDay.dayName}
                </h3>
                <p className="text-emerald-100 text-sm font-medium">
                  {bestOutdoorDay.date} • {bestOutdoorDay.description}
                </p>
              </div>

              <div className="p-3 bg-white/15 backdrop-blur-xs rounded-xl border border-white/20 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-white">
                  Expected: {bestOutdoorDay.tempRange}
                </p>
                <p className="text-emerald-50 text-xs">
                  Why it&apos;s best: {bestOutdoorDay.reason}.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100 relative z-10">
              <span>Rain probability: {bestOutdoorDay.rainProbability}%</span>
              <span className="font-semibold text-white">Recommended Choice</span>
            </div>
          </div>
        )}

        {/* Rule-Based Weather Advisory Cards */}
        <div
          id="recommendation-cards-container"
          className={`${
            bestOutdoorDay ? 'lg:col-span-7' : 'lg:col-span-12'
          } grid grid-cols-1 sm:grid-cols-2 gap-3.5`}
        >
          {recommendations.map((item) => {
            const Icon = getAlertIcon(item.type);
            const style = getAlertBadgeStyle(item.level);

            return (
              <div
                key={item.id}
                id={`recommendation-${item.id}`}
                className={`p-4 rounded-2xl border ${style.container} shadow-xs flex flex-col justify-between gap-3`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${style.iconBg} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                        {item.appliesTo}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.message}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {item.condition}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[11px] font-medium opacity-80">
                    Smart Weather Rule
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.tag}`}
                  >
                    {item.level.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
