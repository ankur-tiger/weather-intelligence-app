import {
  GeocodingResponse,
  GeocodingResult,
  ForecastResponse,
  ProcessedDayForecast,
  RecommendationAlert,
  BestOutdoorDayInfo,
  WeatherIntelligenceData,
} from '../types';
import { getWeatherDetails } from '../utils/weatherCodes';

export class WeatherApiError extends Error {
  type: 'not_found' | 'network';

  constructor(type: 'not_found' | 'network', message: string) {
    super(message);
    this.name = 'WeatherApiError';
    this.type = type;
  }
}

/**
 * Searches for matching cities using Open-Meteo Geocoding API.
 */
export async function searchCities(cityName: string): Promise<GeocodingResult[]> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    throw new WeatherApiError('not_found', 'Please enter a city name.');
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherApiError(
      'network',
      'Weather service is unavailable right now. Please try again.'
    );
  }

  if (!response.ok) {
    throw new WeatherApiError(
      'network',
      'Weather service is unavailable right now. Please try again.'
    );
  }

  let data: GeocodingResponse;
  try {
    data = await response.json();
  } catch {
    throw new WeatherApiError(
      'network',
      'Weather service is unavailable right now. Please try again.'
    );
  }

  if (!data.results || data.results.length === 0) {
    throw new WeatherApiError(
      'not_found',
      'City not found. Please check the spelling and try again.'
    );
  }

  return data.results;
}

/**
 * Fetches the 7-day weather forecast for specified coordinates.
 */
export async function fetchForecast(lat: number, lon: number): Promise<ForecastResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max&timezone=auto&forecast_days=7`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherApiError(
      'network',
      'Weather service is unavailable right now. Please try again.'
    );
  }

  if (!response.ok) {
    throw new WeatherApiError(
      'network',
      'Weather service is unavailable right now. Please try again.'
    );
  }

  try {
    const data: ForecastResponse = await response.json();
    return data;
  } catch {
    throw new WeatherApiError(
      'network',
      'Weather service is unavailable right now. Please try again.'
    );
  }
}

/**
 * Processes raw daily forecast arrays into an array of structured objects.
 */
export function processDailyForecast(daily: ForecastResponse['daily']): ProcessedDayForecast[] {
  const count = daily.time.length;
  const processed: ProcessedDayForecast[] = [];

  for (let i = 0; i < count; i++) {
    const dateStr = daily.time[i];
    const dateObj = new Date(dateStr + 'T00:00:00');
    
    // Determine relative or weekday name
    let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    if (i === 0) {
      dayName = 'Today';
    } else if (i === 1) {
      dayName = 'Tomorrow';
    }

    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const weatherCode = daily.weather_code[i] ?? 0;
    const weatherInfo = getWeatherDetails(weatherCode);

    processed.push({
      index: i,
      date: dateStr,
      dayName,
      formattedDate,
      weatherCode,
      weatherDescription: weatherInfo.description,
      weatherIconName: weatherInfo.iconName,
      tempMax: Math.round(daily.temperature_2m_max[i] ?? 0),
      tempMin: Math.round(daily.temperature_2m_min[i] ?? 0),
      precipitationSum: Number((daily.precipitation_sum[i] ?? 0).toFixed(1)),
      precipProbability: Math.round(daily.precipitation_probability_max[i] ?? 0),
      uvIndexMax: Number((daily.uv_index_max[i] ?? 0).toFixed(1)),
      windSpeedMax: Math.round(daily.wind_speed_10m_max[i] ?? 0),
    });
  }

  return processed;
}

/**
 * Evaluates rule-based planning recommendations from today's forecast and upcoming days.
 *
 * Rules:
 * - rain probability >= 60% -> "Carry an umbrella"
 * - max temp >= 35C -> "Heat alert: stay hydrated"
 * - min temp <= 5C -> "Cold: wear warm layers"
 * - wind >= 40 km/h -> "Windy: secure loose items"
 * - UV index >= 8 -> "High UV: use sunscreen"
 * - otherwise "Good conditions for outdoor plans"
 */
export function generateRecommendations(
  days: ProcessedDayForecast[]
): RecommendationAlert[] {
  if (days.length === 0) return [];

  const today = days[0];
  const alerts: RecommendationAlert[] = [];

  // Check today's condition triggers
  if (today.precipProbability >= 60) {
    alerts.push({
      id: 'rain-today',
      type: 'rain',
      condition: `Rain probability is ${today.precipProbability}%`,
      message: 'Carry an umbrella',
      level: 'warning',
      appliesTo: 'Today',
    });
  }

  if (today.tempMax >= 35) {
    alerts.push({
      id: 'heat-today',
      type: 'heat',
      condition: `High of ${today.tempMax}°C`,
      message: 'Heat alert: stay hydrated',
      level: 'alert',
      appliesTo: 'Today',
    });
  }

  if (today.tempMin <= 5) {
    alerts.push({
      id: 'cold-today',
      type: 'cold',
      condition: `Low of ${today.tempMin}°C`,
      message: 'Cold: wear warm layers',
      level: 'info',
      appliesTo: 'Today',
    });
  }

  if (today.windSpeedMax >= 40) {
    alerts.push({
      id: 'wind-today',
      type: 'wind',
      condition: `Wind gusts up to ${today.windSpeedMax} km/h`,
      message: 'Windy: secure loose items',
      level: 'warning',
      appliesTo: 'Today',
    });
  }

  if (today.uvIndexMax >= 8) {
    alerts.push({
      id: 'uv-today',
      type: 'uv',
      condition: `Peak UV index ${today.uvIndexMax}`,
      message: 'High UV: use sunscreen',
      level: 'warning',
      appliesTo: 'Today',
    });
  }

  // If none of the warning triggers fired for today:
  if (alerts.length === 0) {
    alerts.push({
      id: 'good-today',
      type: 'general',
      condition: `Comfortable ${today.tempMin}°C - ${today.tempMax}°C, rain chance ${today.precipProbability}%`,
      message: 'Good conditions for outdoor plans',
      level: 'favorable',
      appliesTo: 'Today',
    });
  }

  // Also check upcoming days (next 6 days) for significant alerts not already triggered
  for (let i = 1; i < days.length; i++) {
    const day = days[i];
    if (day.precipProbability >= 80 && !alerts.some(a => a.type === 'rain' && a.appliesTo === day.dayName)) {
      alerts.push({
        id: `rain-${day.date}`,
        type: 'rain',
        condition: `${day.dayName}: ${day.precipProbability}% rain probability`,
        message: 'High chance of rain expected',
        level: 'info',
        appliesTo: day.dayName,
      });
    }
    if (day.tempMax >= 38 && !alerts.some(a => a.type === 'heat' && a.appliesTo === day.dayName)) {
      alerts.push({
        id: `heat-${day.date}`,
        type: 'heat',
        condition: `${day.dayName}: peaks at ${day.tempMax}°C`,
        message: 'Extreme heat forecasted',
        level: 'alert',
        appliesTo: day.dayName,
      });
    }
  }

  return alerts;
}

/**
 * Calculates and highlights the best day this week for outdoor activity.
 */
export function calculateBestOutdoorDay(days: ProcessedDayForecast[]): BestOutdoorDayInfo | null {
  if (!days || days.length === 0) return null;

  let bestDay = days[0];
  let highestScore = -Infinity;
  let bestReason = '';

  for (const day of days) {
    let score = 100;

    // Precipitation probability penalty: heavy penalty for rain
    score -= day.precipProbability * 0.8;
    score -= day.precipitationSum * 8;

    // Temperature comfort: ideal 20°C to 28°C
    if (day.tempMax > 30) {
      score -= (day.tempMax - 30) * 3;
    } else if (day.tempMax < 18) {
      score -= (18 - day.tempMax) * 2;
    }

    // Extreme cold
    if (day.tempMin < 8) {
      score -= (8 - day.tempMin) * 2;
    }

    // Wind speed penalty: above 25 km/h
    if (day.windSpeedMax > 25) {
      score -= (day.windSpeedMax - 25) * 1.5;
    }

    // Extreme UV penalty
    if (day.uvIndexMax > 8) {
      score -= (day.uvIndexMax - 8) * 2;
    }

    // Bonus for clear/partly cloudy weather codes (0, 1, 2)
    if (day.weatherCode === 0 || day.weatherCode === 1) {
      score += 15;
    } else if (day.weatherCode === 2) {
      score += 10;
    } else if (day.weatherCode >= 50) {
      score -= 30; // Rain / drizzle / snow
    }

    if (score > highestScore) {
      highestScore = score;
      bestDay = day;

      const reasons: string[] = [];
      if (day.precipProbability < 20) {
        reasons.push(`minimal rain chance (${day.precipProbability}%)`);
      } else {
        reasons.push(`${day.precipProbability}% rain probability`);
      }

      if (day.tempMax <= 30 && day.tempMax >= 20) {
        reasons.push(`ideal high of ${day.tempMax}°C`);
      } else {
        reasons.push(`high of ${day.tempMax}°C`);
      }

      if (day.windSpeedMax < 20) {
        reasons.push(`gentle breeze (${day.windSpeedMax} km/h)`);
      }

      bestReason = reasons.join(', ');
    }
  }

  return {
    dayName: bestDay.dayName,
    date: bestDay.formattedDate,
    description: bestDay.weatherDescription,
    tempRange: `${bestDay.tempMin}°C to ${bestDay.tempMax}°C`,
    reason: bestReason || 'Optimal combination of temperature and clear skies',
    rainProbability: bestDay.precipProbability,
  };
}

/**
 * High-level orchestration to fetch city and weather intelligence.
 */
export async function loadWeatherIntelligence(city: GeocodingResult): Promise<WeatherIntelligenceData> {
  const forecast = await fetchForecast(city.latitude, city.longitude);
  const daily = processDailyForecast(forecast.daily);
  const recommendations = generateRecommendations(daily);
  const bestOutdoorDay = calculateBestOutdoorDay(daily);

  return {
    city,
    current: forecast.current,
    daily,
    recommendations,
    bestOutdoorDay,
    timezone: forecast.timezone,
    fetchedAt: new Date().toISOString(),
  };
}
