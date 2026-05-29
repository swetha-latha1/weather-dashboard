import { useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import WeatherBackground from './components/WeatherBackground';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastCard from './components/ForecastCard';
import HourlyScroll from './components/HourlyScroll';
import QuickCities from './components/QuickCities';

export default function App() {
  const { weather, forecast, hourly, loading, error, unit, searchByCity, searchByCoords, toggleUnit } = useWeather();

  useEffect(() => { searchByCity('London'); }, []);

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => searchByCoords(coords.latitude, coords.longitude),
      () => alert('Location access denied.')
    );
  };

  const handleUnitChange = (newUnit) => {
    toggleUnit(newUnit);
    if (weather) searchByCity(weather.name, newUnit);
  };

  const isNight = weather
    ? (() => {
        const localTime = Date.now() / 1000 + weather.timezone;
        const hour = new Date(localTime * 1000).getUTCHours();
        return hour < 6 || hour >= 20;
      })()
    : false;

  const conditionId = weather?.weather?.[0]?.id ?? null;
  const temp = weather?.main?.temp ?? null;

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <WeatherBackground conditionId={conditionId} isNight={isNight} temp={temp} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 space-y-5">

        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            Weather Dashboard
          </h1>
          <p className="text-white/40 text-sm">Real-time weather · Powered by OpenWeatherMap</p>
        </div>

        {/* Search */}
        <SearchBar onSearch={searchByCity} onLocate={handleLocate} />

        {/* Error */}
        {error && (
          <div className="glass-dark border border-red-400/30 text-red-300 rounded-2xl px-5 py-3 text-sm text-center animate-fade-in-up">
            ⚠️ {error}
          </div>
        )}

        {/* Two-column layout: main content + side panel */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-5">
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in-up">
                <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                <p className="text-white/50 text-sm">Fetching weather data...</p>
              </div>
            )}

            {!loading && weather && (
              <>
                <CurrentWeather weather={weather} unit={unit} onUnitChange={handleUnitChange} isNight={isNight} />
                <HourlyScroll items={hourly} />
                <div className="animate-fade-in-up delay-2">
                  <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">5-Day Forecast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {forecast.map((item, i) => (
                      <ForecastCard key={item.dt} item={item} index={i} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Side panel — Quick Cities */}
          <div className="w-full lg:w-64 shrink-0">
            <QuickCities onSearch={searchByCity} />
          </div>
        </div>

        <p className="text-center text-white/20 text-xs pb-4">
          © Weather Dashboard · Data refreshes on every search
        </p>
      </div>
    </div>
  );
}
