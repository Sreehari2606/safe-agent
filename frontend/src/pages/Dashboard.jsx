import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, AlertTriangle, Map, MessageSquare, Phone, 
  TrendingUp, ChevronRight, Bell, Star, Package,
  Clock, Zap
} from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';
import HazardCard from '../components/HazardCard';
import { useHazards } from '../hooks/useHazards';
import { useWeather } from '../hooks/useWeather';
import { DEFAULT_LOCATION } from '../utils/constants';
import { systemApi } from '../services/api';

const QUICK_ACTIONS = [
  { to: '/report', icon: AlertTriangle, label: 'Report Hazard', color: 'orange', desc: 'Flag a road issue' },
  { to: '/map', icon: Map, label: 'Safety Map', color: 'blue', desc: 'View hazard map' },
  { to: '/assistant', icon: MessageSquare, label: 'AI Assistant', color: 'purple', desc: 'Get safety tips' },
  { to: '/emergency', icon: Phone, label: 'Emergency', color: 'red', desc: 'SOS & contacts' },
];

const COLOR_MAP = {
  orange: 'bg-swiggy-orange/15 border-swiggy-orange/25 text-swiggy-orange',
  blue: 'bg-blue-500/15 border-blue-500/25 text-blue-400',
  purple: 'bg-purple-500/15 border-purple-500/25 text-purple-400',
  red: 'bg-red-500/15 border-red-500/25 text-red-400',
};

export default function Dashboard() {
  const { hazards, loading: hLoading } = useHazards({ page_size: 4, status: 'active' });
  const { weather } = useWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
  const [backendOk, setBackendOk] = useState(null);

  useEffect(() => {
    systemApi.health()
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false));
  }, []);

  const activeHazards = hazards.filter(h => h.status === 'active').length;
  const criticalHazards = hazards.filter(h => h.severity === 'critical').length;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-swiggy-orange to-orange-500 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-16" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-24" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-orange-100 uppercase tracking-wider">Good Evening</span>
              <span className="text-orange-200">👋</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Rahul Kumar</h2>
            <p className="text-orange-100 text-sm mt-1">Stay safe on every delivery · Partner #SW4821</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-orange-100 text-xs">
                <Star className="w-3.5 h-3.5 fill-current text-yellow-300" />
                <span>4.8 rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-orange-100 text-xs">
                <Package className="w-3.5 h-3.5" />
                <span>127 deliveries today</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-full bg-white/20 items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{hLoading ? '–' : activeHazards}</p>
            <p className="text-xs text-gray-400 mt-0.5">Active hazards</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{hLoading ? '–' : criticalHazards}</p>
            <p className="text-xs text-gray-400 mt-0.5">Critical alerts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {weather ? `${Math.round(weather.temperature)}°C` : '–'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Temperature</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            backendOk === true ? 'bg-green-500/15 border border-green-500/25' :
            backendOk === false ? 'bg-red-500/15 border border-red-500/25' :
            'bg-gray-500/15 border border-gray-500/25'
          }`}>
            <Shield className={`w-5 h-5 ${backendOk === true ? 'text-green-400' : backendOk === false ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {backendOk === null ? '...' : backendOk ? 'ON' : 'OFF'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Backend status</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map(({ to, icon: Icon, label, color, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className={`card p-4 flex flex-col items-center gap-2.5 text-center hover:scale-105 transition-all duration-200 border ${COLOR_MAP[color]}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_MAP[color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Hazards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Active Hazard Reports</h2>
              <Link to="/map" className="text-xs text-swiggy-orange hover:text-swiggy-orange-dark flex items-center gap-1 transition-colors">
                View map <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {hLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hazards.length > 0 ? (
              <div className="space-y-3">
                {hazards.slice(0, 4).map(hazard => (
                  <HazardCard key={hazard.id} hazard={hazard} compact />
                ))}
                {hazards.length > 4 && (
                  <Link to="/map" className="block text-center py-2 text-sm text-swiggy-orange hover:text-swiggy-orange-dark transition-colors">
                    View all {hazards.length} reports →
                  </Link>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <Shield className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-white">No active hazards</p>
                <p className="text-xs text-gray-400 mt-1">Your area looks clear</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div>
            <h2 className="section-title mb-3">Live Weather</h2>
            <WeatherWidget lat={DEFAULT_LOCATION.lat} lon={DEFAULT_LOCATION.lon} />
          </div>

          {/* Safety tips */}
          <div>
            <h2 className="section-title mb-3">Safety Reminders</h2>
            <div className="card p-4 space-y-3">
              {[
                { icon: '⛑️', text: 'Always wear your helmet – mandatory by law.' },
                { icon: '💡', text: 'Check your lights before every shift.' },
                { icon: '🌧️', text: 'Reduce speed by 30% in wet conditions.' },
                { icon: '📱', text: 'Share live location during night deliveries.' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-lg shrink-0">{tip.icon}</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity placeholder */}
          <div>
            <h2 className="section-title mb-3">Recent Activity</h2>
            <div className="card p-4 space-y-3">
              {[
                { time: '18:32', event: 'Delivery completed – Koramangala', icon: Package },
                { time: '17:45', event: 'Hazard reported nearby', icon: AlertTriangle },
                { time: '16:20', event: 'Shift started', icon: Clock },
              ].map(({ time, event, icon: Icon }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-10 shrink-0">{time}</span>
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-300">{event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card p-4 border-yellow-500/20 bg-yellow-500/5">
        <p className="text-xs text-yellow-300 text-center">
          ⚠️ <strong>Demo Application:</strong> Hazard data shown is for demonstration purposes. 
          Not affiliated with Swiggy Ltd. Does not represent real road conditions.
        </p>
      </div>
    </div>
  );
}

