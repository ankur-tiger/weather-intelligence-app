export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeatherData {
  time: string;
  interval?: number;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  wind_speed_10m_max: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  utc_offset_seconds?: number;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
}

export interface ProcessedDayForecast {
  index: number;
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  weatherDescription: string;
  weatherIconName: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipProbability: number;
  uvIndexMax: number;
  windSpeedMax: number;
}

export interface RecommendationAlert {
  id: string;
  type: 'rain' | 'heat' | 'cold' | 'wind' | 'uv' | 'general';
  condition: string;
  message: string;
  level: 'alert' | 'warning' | 'info' | 'favorable';
  appliesTo: string; // e.g. "Today" or "Upcoming days"
}

export interface BestOutdoorDayInfo {
  dayName: string;
  date: string;
  description: string;
  tempRange: string;
  reason: string;
  rainProbability: number;
}

export interface WeatherIntelligenceData {
  city: GeocodingResult;
  current: CurrentWeatherData;
  daily: ProcessedDayForecast[];
  recommendations: RecommendationAlert[];
  bestOutdoorDay: BestOutdoorDayInfo | null;
  timezone: string;
  fetchedAt: string;
}

export type ErrorType = 'not_found' | 'network' | 'empty_input' | null;

export interface AppErrorState {
  type: ErrorType;
  message: string;
}
