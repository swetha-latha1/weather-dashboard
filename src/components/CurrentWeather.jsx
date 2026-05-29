import { getWeatherEmoji, getWeatherAccent } from '../utils/weatherEmoji';

const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@4x.png`;

const fmt = (ts, tz) =>
  new Date((ts + tz) * 1000).toUTCString().slice(17, 22);

const detailItems = (w, unit) => [
  { label: 'Feels Like',  value: `${Math.round(w.main.feels_like)}°`,                          icon: '🌡️' },
  { label: 'Humidity',    value: `${w.main.humidity}%`,                                         icon: '💧' },
  { label: 'Wind Speed',  value: `${w.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`,        icon: '💨' },
  { label: 'Wind Dir',    value: `${w.wind.deg}°`,                                              icon: '🧭' },
  { label: 'Visibility',  value: `${(w.visibility / 1000).toFixed(1)} km`,                      icon: '👁️' },
  { label: 'Pressure',    value: `${w.main.pressure} hPa`,                                      icon: '🔵' },
  { label: 'Cloudiness',  value: `${w.clouds.all}%`,                                            icon: '☁️' },
  { label: 'Sunrise',     value: fmt(w.sys.sunrise, w.timezone),                                icon: '🌅' },
  { label: 'Sunset',      value: fmt(w.sys.sunset, w.timezone),                                 icon: '🌇' },
  { label: 'UV Index',    value: 'N/A',                                                         icon: '☀️' },
];

export default function CurrentWeather({ weather, unit, onUnitChange, isNight = false }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const conditionId = weather.weather[0].id;
  const emoji = getWeatherEmoji(conditionId, isNight);
  const accent = getWeatherAccent(conditionId);

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-fade-in-up space-y-6">

      {/* Top: location + unit toggle */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {weather.name}, <span className="text-white/60">{weather.sys.country}</span>
            </h2>
          </div>
          <p className="text-white/40 text-sm mt-1">{dateStr} · {timeStr}</p>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-white/20 glass-dark">
          {['metric', 'imperial'].map((u) => (
            <button key={u} onClick={() => onUnitChange(u)}
              className={`px-4 py-2 text-sm font-semibold transition-all duration-200 ${unit === u ? 'bg-white/25 text-white' : 'text-white/40 hover:text-white/70'}`}>
              {u === 'metric' ? '°C' : '°F'}
            </button>
          ))}
        </div>
      </div>

      {/* Main weather display */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Animated icon + emoji badge */}
        <div className="relative animate-float-card">
          <img
            src={iconUrl(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className="w-28 h-28 md:w-36 md:h-36 drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
          />
          {/* Big emoji overlay bottom-right */}
          <span className="absolute -bottom-2 -right-2 text-4xl drop-shadow-lg select-none">
            {emoji}
          </span>
        </div>

        {/* Temp + description */}
        <div className="flex-1 min-w-[160px]">
          <div className="flex items-start gap-1">
            <span className="text-7xl md:text-8xl font-black text-white leading-none tracking-tighter"
              style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
              {Math.round(weather.main.temp)}
            </span>
            <span className="text-3xl font-light text-white/60 mt-3">°{unit === 'metric' ? 'C' : 'F'}</span>
          </div>
          <p className={`capitalize text-xl font-medium mt-1 flex items-center gap-2 ${accent}`}>
            <span>{emoji}</span>{weather.weather[0].description}
          </p>
          <div className="flex gap-3 mt-2">
            <span className="text-sm text-white/50">↑ {Math.round(weather.main.temp_max)}°</span>
            <span className="text-sm text-white/50">↓ {Math.round(weather.main.temp_min)}°</span>
          </div>
        </div>

        {/* Quick stats pill */}
        <div className="flex flex-col gap-2 glass-dark rounded-2xl px-5 py-4 min-w-[130px]">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span>💧</span><span>{weather.main.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span>💨</span><span>{weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span>👁️</span><span>{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {detailItems(weather, unit).map(({ label, value, icon }) => (
          <div key={label}
            className="glass-dark rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center hover:bg-white/10 transition-all duration-200 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
            <p className="text-white font-bold text-sm">{value}</p>
            <p className="text-white/40 text-xs">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
