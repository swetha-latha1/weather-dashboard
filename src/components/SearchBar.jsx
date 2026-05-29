import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function SearchBar({ onSearch, onLocate }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Fetch suggestions from Geocoding API
  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); setOpen(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=6&appid=${API_KEY}`
        );
        const data = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
        setActive(-1);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (!wrapperRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Compute dropdown position from input bounding rect
  const updateDropdownPos = useCallback(() => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 2,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (open) updateDropdownPos();
  }, [open, updateDropdownPos]);

  useEffect(() => {
    window.addEventListener('resize', updateDropdownPos);
    window.addEventListener('scroll', updateDropdownPos, true);
    return () => {
      window.removeEventListener('resize', updateDropdownPos);
      window.removeEventListener('scroll', updateDropdownPos, true);
    };
  }, [updateDropdownPos]);

  const pick = (s) => {
    const label = [s.name, s.state, s.country].filter(Boolean).join(', ');
    onSearch(s.name);
    setQuery('');
    setSuggestions([]);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((p) => Math.min(p + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((p) => Math.max(p - 1, 0)); }
    if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(suggestions[active]); }
    if (e.key === 'Escape') setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) { onSearch(query.trim()); setQuery(''); setOpen(false); }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto animate-fade-in-up">
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* Input */}
        <div
          ref={inputRef}
          className={`flex flex-1 items-center gap-2 px-4 py-2.5 rounded-2xl glass transition-all duration-300 ${open ? 'ring-2 ring-white/30' : ''}`}
        >
          <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) { setOpen(true); updateDropdownPos(); } }}
            placeholder="Search city, state or country..."
            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); }}
              className="text-white/30 hover:text-white/60 transition text-lg leading-none">×</button>
          )}
        </div>

        <button type="submit"
          className="px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold glass transition-all duration-200 hover:scale-105 active:scale-95">
          Search
        </button>

        <button type="button" onClick={onLocate} title="Use my location"
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white glass transition-all duration-200 hover:scale-105 active:scale-95">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </button>
      </form>

      {/* Dropdown — portaled to document.body so it escapes every stacking context */}
      {open && suggestions.length > 0 && createPortal(
        <ul
          style={dropdownStyle}
          className="dropdown-portal rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.lat}-${s.lon}`}
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150
                ${i === active ? 'bg-white/25' : 'hover:bg-white/12'}
                ${i !== suggestions.length - 1 ? 'border-b border-white/8' : ''}`}
            >
              <span className="text-xl shrink-0">
                {s.country
                  ? String.fromCodePoint(...[...s.country.toUpperCase()].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)))
                  : '🌍'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{s.name}</p>
                <p className="text-white/50 text-xs truncate">
                  {[s.state, s.country].filter(Boolean).join(' · ')}
                </p>
              </div>
              <span className="text-white/30 text-xs shrink-0">
                {s.lat.toFixed(1)}°, {s.lon.toFixed(1)}°
              </span>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}
