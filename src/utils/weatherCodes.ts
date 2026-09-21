import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  SunMedium,
  type LucideIcon,
} from 'lucide-react';

export interface WeatherCodeInfo {
  code: number;
  description: string;
  icon: LucideIcon;
  iconName: string;
  category: 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunder';
  color: string;
  bgColor: string;
}

export const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: {
    code: 0,
    description: 'Clear Sky',
    icon: Sun,
    iconName: 'Sun',
    category: 'clear',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  1: {
    code: 1,
    description: 'Mainly Clear',
    icon: SunMedium,
    iconName: 'SunMedium',
    category: 'clear',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  2: {
    code: 2,
    description: 'Partly Cloudy',
    icon: CloudSun,
    iconName: 'CloudSun',
    category: 'partly-cloudy',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
  },
  3: {
    code: 3,
    description: 'Overcast',
    icon: Cloud,
    iconName: 'Cloud',
    category: 'cloudy',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  45: {
    code: 45,
    description: 'Foggy',
    icon: CloudFog,
    iconName: 'CloudFog',
    category: 'fog',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
  },
  48: {
    code: 48,
    description: 'Depositing Rime Fog',
    icon: CloudFog,
    iconName: 'CloudFog',
    category: 'fog',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
  },
  51: {
    code: 51,
    description: 'Light Drizzle',
    icon: CloudDrizzle,
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  53: {
    code: 53,
    description: 'Moderate Drizzle',
    icon: CloudDrizzle,
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  55: {
    code: 55,
    description: 'Dense Drizzle',
    icon: CloudDrizzle,
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  56: {
    code: 56,
    description: 'Light Freezing Drizzle',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  57: {
    code: 57,
    description: 'Dense Freezing Drizzle',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  61: {
    code: 61,
    description: 'Slight Rain',
    icon: CloudRain,
    iconName: 'CloudRain',
    category: 'rain',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  63: {
    code: 63,
    description: 'Moderate Rain',
    icon: CloudRain,
    iconName: 'CloudRain',
    category: 'rain',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  65: {
    code: 65,
    description: 'Heavy Rain',
    icon: CloudRain,
    iconName: 'CloudRain',
    category: 'rain',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  66: {
    code: 66,
    description: 'Light Freezing Rain',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  67: {
    code: 67,
    description: 'Heavy Freezing Rain',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100',
  },
  71: {
    code: 71,
    description: 'Slight Snow Fall',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-50',
  },
  73: {
    code: 73,
    description: 'Moderate Snow Fall',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  75: {
    code: 75,
    description: 'Heavy Snow Fall',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  77: {
    code: 77,
    description: 'Snow Grains',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  80: {
    code: 80,
    description: 'Slight Rain Showers',
    icon: CloudRain,
    iconName: 'CloudRain',
    category: 'rain',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  81: {
    code: 81,
    description: 'Moderate Rain Showers',
    icon: CloudRain,
    iconName: 'CloudRain',
    category: 'rain',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  82: {
    code: 82,
    description: 'Violent Rain Showers',
    icon: CloudRain,
    iconName: 'CloudRain',
    category: 'rain',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  85: {
    code: 85,
    description: 'Slight Snow Showers',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  86: {
    code: 86,
    description: 'Heavy Snow Showers',
    icon: Snowflake,
    iconName: 'Snowflake',
    category: 'snow',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  95: {
    code: 95,
    description: 'Thunderstorm',
    icon: CloudLightning,
    iconName: 'CloudLightning',
    category: 'thunder',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  96: {
    code: 96,
    description: 'Thunderstorm with Hail',
    icon: CloudLightning,
    iconName: 'CloudLightning',
    category: 'thunder',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  99: {
    code: 99,
    description: 'Heavy Thunderstorm with Hail',
    icon: CloudLightning,
    iconName: 'CloudLightning',
    category: 'thunder',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
};

export function getWeatherDetails(code: number): WeatherCodeInfo {
  if (code in WEATHER_CODE_MAP) {
    return WEATHER_CODE_MAP[code];
  }
  // Fallback for unexpected codes
  if (code >= 90) {
    return WEATHER_CODE_MAP[95];
  }
  if (code >= 70) {
    return WEATHER_CODE_MAP[71];
  }
  if (code >= 60) {
    return WEATHER_CODE_MAP[61];
  }
  if (code >= 50) {
    return WEATHER_CODE_MAP[51];
  }
  if (code >= 40) {
    return WEATHER_CODE_MAP[45];
  }
  return {
    code,
    description: 'Clear Sky',
    icon: Sun,
    iconName: 'Sun',
    category: 'clear',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  };
}

export function formatDateTime(isoString: string, timeZone?: string): string {
  try {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone || undefined,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return isoString.replace('T', ' ');
  }
}
