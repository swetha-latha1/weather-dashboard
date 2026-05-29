import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const HOTTEST = ['Kuwait City', 'Riyadh', 'Dubai', 'Phoenix', 'Doha', 'Karachi', 'Baghdad', 'Muscat'];
const COOLEST = ['Yakutsk', 'Oymyakon', 'Barrow', 'Reykjavik', 'Tromsø', 'Murmansk', 'Fairbanks', 'Nuuk'];

async function fetchTemp(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) return null;
  const d = await res.json();
  return { name: d.name, country: d.sys.country, temp: Math.round(d.main.temp), icon: d.weather[0].icon, id: d.weather[0].id };
}

function CityRow({ city, onSearch, rank }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchTemp(city).then(setData);
  }, [city]);

  return (
    <button
      onClick={() => data && onSearch(city)}
      disabled={!data}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 group disabled:opacity-40 text-left"
    >
      <span className="text-white/30 text-xs w-4 shrink-0">{rank}</span>
      {data ? (
        <>
          <img src={`https://openweathermap.org/img/wn/${data.icon}.png`} alt="" className="w-8 h-8 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate group-hover:text-white transition">{data.name}</p>
            <p className="text-white/40 text-xs">{data.country}</p>
          </div>
          <span className="text-white font-bold text-sm shrink-0">{data.temp}°</span>
        </>
      ) : (
        <>
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-2.5 bg-white/10 rounded animate-pulse w-3/4" />
            <div className="h-2 bg-white/5 rounded animate-pulse w-1/2" />
          </div>
        </>
      )}
    </button>
  );
}

export default function QuickCities({ onSearch }) {
  const [tab, setTab] = useState('hot');

  const cities = tab === 'hot' ? HOTTEST : COOLEST;

  return (
    <div className="glass rounded-3xl p-4 flex flex-col gap-3 animate-fade-in-up h-fit">
      {/* Tab toggle */}
      <div className="flex rounded-xl overflow-hidden glass-dark p-0.5 gap-0.5">
        <button
          onClick={() => setTab('hot')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5
            ${tab === 'hot' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
        >
          🔥 Hottest
        </button>
        <button
          onClick={() => setTab('cool')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5
            ${tab === 'cool' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
        >
          ❄️ Coolest
        </button>
      </div>

      {/* Label */}
      <p className="text-white/30 text-xs px-1">
        {tab === 'hot' ? 'World\'s hottest cities right now' : 'World\'s coolest cities right now'}
      </p>

      {/* City list */}
      <div className="flex flex-col gap-0.5">
        {cities.map((city, i) => (
          <CityRow key={city} city={city} onSearch={onSearch} rank={i + 1} />
        ))}
      </div>

      <p className="text-white/20 text-xs text-center pt-1">Click any city to view weather</p>
    </div>
  );
}
