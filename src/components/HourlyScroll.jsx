import { getWeatherEmoji } from '../utils/weatherEmoji';

const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

export default function HourlyScroll({ items }) {
  return (
    <div className="glass rounded-3xl p-5 animate-fade-in-up delay-1">
      <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Hourly Forecast</h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item, i) => {
          const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          const isNow = i === 0;
          const emoji = getWeatherEmoji(item.weather[0].id);
          return (
            <div key={item.dt}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 min-w-[76px] shrink-0 transition-all duration-200 hover:scale-105 cursor-default
                ${isNow ? 'bg-white/25 ring-1 ring-white/30' : 'glass-dark hover:bg-white/10'}`}>
              <p className={`text-xs font-medium ${isNow ? 'text-white' : 'text-white/50'}`}>{isNow ? 'Now' : time}</p>
              <div className="relative">
                <img src={iconUrl(item.weather[0].icon)} alt="" className="w-10 h-10" />
                <span className="absolute -bottom-1 -right-1 text-sm select-none">{emoji}</span>
              </div>
              <p className="text-white font-bold text-sm">{Math.round(item.main.temp)}°</p>
              <p className="text-sky-300 text-xs">💧{item.main.humidity}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
