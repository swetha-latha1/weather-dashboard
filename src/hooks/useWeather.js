import { useState, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');

  // unit is passed explicitly so callers always use the latest value
  const fetchData = useCallback(async (query, activeUnit) => {
    setLoading(true);
    setError('');
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE}/weather?${query}&units=${activeUnit}&appid=${API_KEY}`),
        fetch(`${BASE}/forecast?${query}&units=${activeUnit}&appid=${API_KEY}`),
      ]);

      if (!currentRes.ok) {
        const errData = await currentRes.json();
        if (currentRes.status === 401) throw new Error('Invalid or inactive API key. Wait 10–15 min after creating a new key.');
        if (currentRes.status === 404) throw new Error('City not found. Please check the spelling.');
        throw new Error(errData.message || 'Something went wrong.');
      }

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      setWeather(currentData);
      setHourly(forecastData.list.slice(0, 8));
      const daily = forecastData.list.filter((item) => item.dt_txt.includes('12:00:00'));
      setForecast(daily.slice(0, 5));
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
      setHourly([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCity   = (city, u)        => fetchData(`q=${encodeURIComponent(city)}`, u ?? unit);
  const searchByCoords = (lat, lon, u)    => fetchData(`lat=${lat}&lon=${lon}`, u ?? unit);
  const toggleUnit     = (newUnit)        => setUnit(newUnit);

  return { weather, forecast, hourly, loading, error, unit, searchByCity, searchByCoords, toggleUnit };
}
