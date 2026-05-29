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

  const fetchData = useCallback(async (query) => {
    setLoading(true);
    setError('');
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE}/weather?${query}&units=${unit}&appid=${API_KEY}`),
        fetch(`${BASE}/forecast?${query}&units=${unit}&appid=${API_KEY}`),
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

      // Hourly: next 8 slots (24 hrs)
      setHourly(forecastData.list.slice(0, 8));

      // Daily: one entry per day at ~12:00
      const daily = forecastData.list.filter((item) =>
        item.dt_txt.includes('12:00:00')
      );
      setForecast(daily.slice(0, 5));
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
      setHourly([]);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const searchByCity = (city) => fetchData(`q=${encodeURIComponent(city)}`);

  const searchByCoords = (lat, lon) => fetchData(`lat=${lat}&lon=${lon}`);

  const toggleUnit = (newUnit) => setUnit(newUnit);

  return { weather, forecast, hourly, loading, error, unit, searchByCity, searchByCoords, toggleUnit };
}
