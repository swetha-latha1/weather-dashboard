/**
 * Returns the right emoji based on OpenWeatherMap condition ID
 * https://openweathermap.org/weather-conditions
 */
export function getWeatherEmoji(conditionId, isNight = false) {
  if (!conditionId) return '🌡️';

  // Thunderstorm (200–232)
  if (conditionId >= 200 && conditionId < 210) return '⛈️';   // thunderstorm + light rain
  if (conditionId >= 210 && conditionId < 221) return '🌩️';   // thunderstorm only
  if (conditionId >= 221 && conditionId < 300) return '⛈️';   // heavy thunderstorm + rain/hail

  // Drizzle (300–321)
  if (conditionId >= 300 && conditionId < 321) return '🌦️';

  // Rain (500–531)
  if (conditionId === 500) return '🌧️';                        // light rain
  if (conditionId === 501) return '🌧️';                        // moderate rain
  if (conditionId >= 502 && conditionId <= 504) return '⛈️';  // heavy / extreme rain
  if (conditionId === 511) return '🌨️';                        // freezing rain
  if (conditionId >= 520 && conditionId < 532) return '🌧️';   // shower rain

  // Snow (600–622)
  if (conditionId >= 600 && conditionId < 623) return '❄️';

  // Atmosphere (700–781)
  if (conditionId === 781) return '🌪️';
  if (conditionId === 762) return '🌋';
  if (conditionId === 731 || conditionId === 761) return '🌪️';
  if (conditionId === 771) return '💨';
  if (conditionId >= 700 && conditionId < 782) return '🌫️';

  // Clear (800)
  if (conditionId === 800) return isNight ? '🌙' : '☀️';

  // Clouds (801–804)
  if (conditionId === 801) return '🌤️';
  if (conditionId === 802) return '⛅';
  if (conditionId >= 803) return '☁️';

  return '🌡️';
}

export function getWeatherAccent(conditionId) {
  if (!conditionId) return 'text-white';
  if (conditionId < 300) return 'text-yellow-300';
  if (conditionId < 600) return 'text-sky-300';
  if (conditionId < 700) return 'text-blue-200';
  if (conditionId < 800) return 'text-gray-300';
  if (conditionId === 800) return 'text-amber-300';
  return 'text-slate-300';
}
