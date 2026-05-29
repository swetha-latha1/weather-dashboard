import { getWeatherEmoji, getWeatherAccent } from '../utils/weatherEmoji';

const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

export default function ForecastCard({ item, index = 0 }) {
  const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
  const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const pop = Math.round((item.pop || 0) * 100);
  const emoji = getWeatherEmoji(item.weather[0].id);
  const accent = getWeatherAccent(item.weather[0].id);

  return (
    <div
      className="glass-dark rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 cursor-default animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <p className="text-white font-semibold text-sm">{day}</p>
      <p className="text-white/40 text-xs">{date}</p>
      <div className="relative my-1">
        <img src={iconUrl(item.weather[0].icon)} alt={item.weather[0].description} className="w-12 h-12" />
        <span className="absolute -bottom-1 -right-1 text-lg select-none">{emoji}</span>
      </div>
      <p className="text-white font-bold text-lg leading-none">{Math.round(item.main.temp_max)}°</p>
      <p className="text-white/40 text-sm">{Math.round(item.main.temp_min)}°</p>
      <p className={`text-xs capitalize text-center leading-tight ${accent}`}>{item.weather[0].description}</p>
      {pop > 0 && <p className="text-sky-300 text-xs">💧 {pop}%</p>}
    </div>
  );
}
