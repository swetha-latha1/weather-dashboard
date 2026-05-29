// Maps weather condition id → theme config
export function getTheme(conditionId, isNight) {
  if (!conditionId) return themes.default;
  if (conditionId >= 200 && conditionId < 300) return themes.thunderstorm;
  if (conditionId >= 300 && conditionId < 600) return themes.rain;
  if (conditionId >= 600 && conditionId < 700) return themes.snow;
  if (conditionId >= 700 && conditionId < 800) return themes.fog;
  if (conditionId === 800) return isNight ? themes.clearNight : themes.clearDay;
  if (conditionId === 801 || conditionId === 802) return isNight ? themes.fewCloudsNight : themes.fewClouds;
  if (conditionId >= 803) return themes.overcast;
  return themes.default;
}

const themes = {
  clearDay:      { sky: 'from-sky-400 via-blue-500 to-indigo-600',      clouds: 'white',   cloudOpacity: 0.5,  speed: 'slow',  extras: 'sun'         },
  clearNight:    { sky: 'from-indigo-950 via-blue-950 to-slate-900',    clouds: 'slate',   cloudOpacity: 0.3,  speed: 'slow',  extras: 'stars'       },
  fewClouds:     { sky: 'from-sky-500 via-blue-600 to-indigo-700',      clouds: 'white',   cloudOpacity: 0.75, speed: 'slow',  extras: 'sun'         },
  fewCloudsNight:{ sky: 'from-indigo-900 via-slate-900 to-gray-950',    clouds: 'slate',   cloudOpacity: 0.5,  speed: 'slow',  extras: 'stars'       },
  overcast:      { sky: 'from-slate-500 via-gray-600 to-slate-700',     clouds: 'gray',    cloudOpacity: 1,    speed: 'med',   extras: 'none'        },
  rain:          { sky: 'from-slate-700 via-gray-800 to-slate-900',     clouds: 'gray',    cloudOpacity: 1,    speed: 'fast',  extras: 'rain'        },
  thunderstorm:  { sky: 'from-gray-900 via-slate-900 to-zinc-950',      clouds: 'zinc',    cloudOpacity: 1,    speed: 'fast',  extras: 'thunderstorm'},
  snow:          { sky: 'from-slate-300 via-blue-200 to-indigo-300',    clouds: 'white',   cloudOpacity: 0.9,  speed: 'slow',  extras: 'snow'        },
  fog:           { sky: 'from-gray-400 via-slate-400 to-gray-500',      clouds: 'gray',    cloudOpacity: 1,    speed: 'slow',  extras: 'fog'         },
  default:       { sky: 'from-sky-500 via-blue-600 to-indigo-700',      clouds: 'white',   cloudOpacity: 0.6,  speed: 'slow',  extras: 'none'        },
};

// SVG cloud shape
function Cloud({ x, y, scale = 1, opacity = 0.8, color = 'white', animClass = '', delay = '' }) {
  const fill = color === 'white' ? 'rgba(255,255,255,' : color === 'gray' ? 'rgba(180,190,200,' : color === 'slate' ? 'rgba(140,155,175,' : 'rgba(200,210,220,';
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} style={{ opacity }} className={`${animClass} ${delay}`}>
      <ellipse cx="60"  cy="40" rx="50" ry="30" fill={`${fill}${opacity})`} />
      <ellipse cx="100" cy="30" rx="40" ry="28" fill={`${fill}${opacity})`} />
      <ellipse cx="140" cy="38" rx="45" ry="26" fill={`${fill}${opacity})`} />
      <ellipse cx="90"  cy="50" rx="70" ry="22" fill={`${fill}${opacity})`} />
    </g>
  );
}

// Rain drops
function Rain() {
  return (
    <g>
      {Array.from({ length: 40 }).map((_, i) => (
        <line
          key={i}
          x1={Math.random() * 1200} y1={-10}
          x2={Math.random() * 1200 - 20} y2={30}
          stroke="rgba(174,214,241,0.6)" strokeWidth="1.5"
          className={`animate-rain delay-${(i % 7) + 1}`}
          style={{ animationDelay: `${(i * 0.07).toFixed(2)}s` }}
        />
      ))}
    </g>
  );
}

// Snow flakes
function Snow() {
  return (
    <g>
      {Array.from({ length: 35 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 1200} cy={Math.random() * 100}
          r={Math.random() * 3 + 1}
          fill="rgba(255,255,255,0.85)"
          className="animate-snow"
          style={{ animationDelay: `${(i * 0.15).toFixed(2)}s`, animationDuration: `${3 + Math.random() * 3}s` }}
        />
      ))}
    </g>
  );
}

// Lightning bolt
function Lightning() {
  return (
    <polyline
      points="620,0 590,120 615,120 580,260"
      fill="none" stroke="rgba(255,255,180,0.95)" strokeWidth="3"
      className="animate-lightning"
      style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,150,1))' }}
    />
  );
}

// Fog layers
function Fog() {
  return (
    <g>
      {[80, 200, 320, 440].map((y, i) => (
        <ellipse key={i} cx="600" cy={y} rx="700" ry="60"
          fill="rgba(200,210,220,0.15)"
          className={`animate-fog delay-${i + 1}`}
        />
      ))}
    </g>
  );
}

// Stars
function Stars() {
  return (
    <g>
      {Array.from({ length: 60 }).map((_, i) => (
        <circle key={i}
          cx={Math.random() * 1200} cy={Math.random() * 300}
          r={Math.random() * 1.5 + 0.5}
          fill="white" opacity={Math.random() * 0.8 + 0.2}
          className="animate-pulse-glow"
          style={{ animationDelay: `${(i * 0.1).toFixed(1)}s` }}
        />
      ))}
    </g>
  );
}

// Sun
function Sun() {
  return (
    <g transform="translate(980, 80)">
      <circle cx="0" cy="0" r="48" fill="rgba(251,191,36,0.9)" style={{ filter: 'drop-shadow(0 0 24px rgba(251,191,36,0.8))' }} />
      <circle cx="0" cy="0" r="60" fill="rgba(251,191,36,0.15)" className="animate-pulse-glow" />
      {[0,45,90,135,180,225,270,315].map((deg) => (
        <line key={deg}
          x1={Math.cos(deg * Math.PI/180) * 65} y1={Math.sin(deg * Math.PI/180) * 65}
          x2={Math.cos(deg * Math.PI/180) * 80} y2={Math.sin(deg * Math.PI/180) * 80}
          stroke="rgba(251,191,36,0.6)" strokeWidth="3" strokeLinecap="round"
          className="animate-spin-slow"
          style={{ transformOrigin: '0 0' }}
        />
      ))}
    </g>
  );
}

export default function WeatherBackground({ conditionId, isNight }) {
  const theme = getTheme(conditionId, isNight);

  return (
    <div className={`fixed inset-0 -z-10 bg-gradient-to-b ${theme.sky} transition-all duration-1000`}>
      <svg
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stars / Sun */}
        {theme.extras === 'stars' && <Stars />}
        {(theme.extras === 'sun' || theme.extras === 'none') && conditionId === 800 && !isNight && <Sun />}

        {/* Cloud layer 1 — back, slow */}
        <Cloud x={-180} y={20}  scale={1.4} opacity={theme.cloudOpacity * 0.5} color={theme.clouds} animClass="animate-drift-slow" delay="delay-1" />
        <Cloud x={300}  y={60}  scale={1.1} opacity={theme.cloudOpacity * 0.6} color={theme.clouds} animClass="animate-drift-slow" delay="delay-3" />
        <Cloud x={700}  y={10}  scale={1.6} opacity={theme.cloudOpacity * 0.4} color={theme.clouds} animClass="animate-drift-slow" delay="delay-2" />

        {/* Cloud layer 2 — mid */}
        <Cloud x={-100} y={100} scale={1.0} opacity={theme.cloudOpacity * 0.75} color={theme.clouds} animClass="animate-drift-med" delay="delay-2" />
        <Cloud x={400}  y={80}  scale={1.3} opacity={theme.cloudOpacity * 0.8}  color={theme.clouds} animClass="animate-drift-med" delay="delay-4" />
        <Cloud x={850}  y={120} scale={0.9} opacity={theme.cloudOpacity * 0.7}  color={theme.clouds} animClass="animate-drift-med" delay="delay-1" />

        {/* Cloud layer 3 — front, fast */}
        <Cloud x={-50}  y={160} scale={0.8} opacity={theme.cloudOpacity * 0.9} color={theme.clouds} animClass="animate-drift-fast" delay="delay-3" />
        <Cloud x={500}  y={140} scale={1.1} opacity={theme.cloudOpacity}       color={theme.clouds} animClass="animate-drift-fast" delay="delay-5" />
        <Cloud x={900}  y={170} scale={0.7} opacity={theme.cloudOpacity * 0.85}color={theme.clouds} animClass="animate-drift-fast" delay="delay-2" />

        {/* Weather extras */}
        {theme.extras === 'rain'         && <Rain />}
        {theme.extras === 'thunderstorm' && <><Rain /><Lightning /></>}
        {theme.extras === 'snow'         && <Snow />}
        {theme.extras === 'fog'          && <Fog />}
      </svg>

      {/* Bottom fade so content is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  );
}
