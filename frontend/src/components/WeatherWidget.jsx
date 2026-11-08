import { CloudRain, Wind, Droplets, Thermometer, Eye, AlertCircle, RefreshCw, Sun, Cloud, Zap } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

const WEATHER_ICONS = {
  safe: Sun,
  caution: Cloud,
  dangerous: Zap,
};

const SAFETY_STYLES = {
  safe: 'text-green-400 bg-green-500/10 border-green-500/20',
  caution: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  dangerous: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function WeatherWidget({ lat, lon, compact = false }) {
  const { weather, loading, error, refetch } = useWeather(lat, lon);

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl" />
          <div>
            <div className="h-4 bg-white/10 rounded w-32 mb-2" />
            <div className="h-3 bg-white/5 rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Weather unavailable</p>
            <p className="text-xs text-gray-500 mt-0.5">{error}</p>
          </div>
          <button onClick={refetch} className="ml-auto text-gray-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const SafetyIcon = WEATHER_ICONS[weather.safety_level] || Sun;
  const safetyStyle = SAFETY_STYLES[weather.safety_level] || SAFETY_STYLES.safe;

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-2xl">
            {weather.weather_code >= 95 ? '⛈️' : weather.weather_code >= 61 ? '🌧️' : weather.weather_code >= 45 ? '🌫️' : weather.weather_code >= 2 ? '⛅' : '☀️'}
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {Math.round(weather.temperature)}°C
            </div>
            <div className="text-sm text-gray-400">{weather.condition}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${safetyStyle}`}>
            <SafetyIcon className="w-3.5 h-3.5" />
            {weather.safety_level === 'safe' ? 'Safe to ride' : 
             weather.safety_level === 'caution' ? 'Use caution' : 'Dangerous'}
          </div>
          <button onClick={refetch} className="text-gray-500 hover:text-gray-300 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {!compact && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-navy-800/60 rounded-xl p-3 flex items-center gap-2.5">
            <Thermometer className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Feels like</p>
              <p className="text-sm font-semibold text-white">{Math.round(weather.apparent_temperature)}°C</p>
            </div>
          </div>
          <div className="bg-navy-800/60 rounded-xl p-3 flex items-center gap-2.5">
            <Wind className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Wind speed</p>
              <p className="text-sm font-semibold text-white">{Math.round(weather.wind_speed)} km/h</p>
            </div>
          </div>
          <div className="bg-navy-800/60 rounded-xl p-3 flex items-center gap-2.5">
            <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="text-sm font-semibold text-white">{weather.humidity}%</p>
            </div>
          </div>
          <div className="bg-navy-800/60 rounded-xl p-3 flex items-center gap-2.5">
            <CloudRain className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Rain chance</p>
              <p className="text-sm font-semibold text-white">{weather.precipitation_probability}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning banner */}
      {weather.safety_level === 'dangerous' && (
        <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">
            Dangerous weather conditions detected. Consider pausing deliveries and seek shelter.
          </p>
        </div>
      )}
      {weather.safety_level === 'caution' && (
        <div className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-300">
            Use caution. Reduce speed and increase following distance in wet conditions.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-600 mt-3">📡 Live data · Open-Meteo</p>
    </div>
  );
}

