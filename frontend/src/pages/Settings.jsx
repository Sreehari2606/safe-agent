import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Moon, Globe, ChevronRight, Save, CheckCircle } from 'lucide-react';

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-swiggy-orange' : 'bg-navy-700 border border-white/10'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rahul Kumar',
    partner_id: 'SW4821',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    vehicle: 'Two-Wheeler',
  });
  const [notifications, setNotifications] = useState({
    hazard_alerts: true,
    weather_warnings: true,
    night_mode_remind: true,
    daily_safety_tip: false,
    email_digest: false,
  });
  const [prefs, setPrefs] = useState({
    dark_mode: true,
    high_contrast: false,
    language: 'English',
    unit: 'Metric',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const setP = (k) => (e) => setProfile(p => ({ ...p, [k]: e.target.value }));
  const toggleN = (k) => (v) => setNotifications(n => ({ ...n, [k]: v }));
  const togglePref = (k) => (v) => setPrefs(p => ({ ...p, [k]: v }));

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-swiggy-orange" />
          Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your profile, notifications, and preferences.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-300 text-sm font-medium">Settings saved successfully (demo)</p>
        </div>
      )}

      {/* Profile */}
      <div className="card p-6">
        <h2 className="font-bold text-white mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-swiggy-orange" />
          Delivery Partner Profile
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-swiggy-orange flex items-center justify-center text-2xl font-bold text-white shrink-0">
            RK
          </div>
          <div>
            <p className="font-semibold text-white">{profile.name}</p>
            <p className="text-sm text-gray-400">Partner ID: {profile.partner_id}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-xs text-green-400">Active</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
            <input type="text" value={profile.name} onChange={setP('name')} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Partner ID</label>
            <input type="text" value={profile.partner_id} onChange={setP('partner_id')} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone Number</label>
            <input type="tel" value={profile.phone} onChange={setP('phone')} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">City</label>
            <input type="text" value={profile.city} onChange={setP('city')} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Vehicle Type</label>
            <select value={profile.vehicle} onChange={setP('vehicle')} className="select-field">
              <option>Two-Wheeler</option>
              <option>Bicycle</option>
              <option>Three-Wheeler</option>
              <option>Car</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="font-bold text-white mb-5 flex items-center gap-2">
          <Bell className="w-4 h-4 text-swiggy-orange" />
          Notification Preferences
        </h2>
        <div className="space-y-4">
          {[
            { key: 'hazard_alerts', label: 'Hazard Alerts', desc: 'Get notified about new hazards in your area' },
            { key: 'weather_warnings', label: 'Weather Warnings', desc: 'Severe weather alerts before your shift' },
            { key: 'night_mode_remind', label: 'Night Mode Reminder', desc: 'Remind me of night safety tips after 7 PM' },
            { key: 'daily_safety_tip', label: 'Daily Safety Tip', desc: 'Receive one safety tip every morning' },
            { key: 'email_digest', label: 'Email Digest', desc: 'Weekly safety summary to your email' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <Toggle checked={notifications[key]} onChange={toggleN(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* App Preferences */}
      <div className="card p-6">
        <h2 className="font-bold text-white mb-5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-swiggy-orange" />
          App Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">Dark Mode</p>
              <p className="text-xs text-gray-400 mt-0.5">Use dark theme (always on in this demo)</p>
            </div>
            <Toggle checked={prefs.dark_mode} onChange={togglePref('dark_mode')} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">High Contrast</p>
              <p className="text-xs text-gray-400 mt-0.5">Improve visibility in bright sunlight</p>
            </div>
            <Toggle checked={prefs.high_contrast} onChange={togglePref('high_contrast')} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Language</label>
            <select value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))} className="select-field">
              <option>English</option>
              <option>हिन्दी (Hindi)</option>
              <option>ಕನ್ನಡ (Kannada)</option>
              <option>தமிழ் (Tamil)</option>
              <option>తెలుగు (Telugu)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Units</label>
            <select value={prefs.unit} onChange={e => setPrefs(p => ({ ...p, unit: e.target.value }))} className="select-field">
              <option>Metric (°C, km/h)</option>
              <option>Imperial (°F, mph)</option>
            </select>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="card p-6">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-swiggy-orange" />
          About SafeRoute
        </h2>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-white">1.0.0 (Demo)</span>
          </div>
          <div className="flex justify-between">
            <span>Backend</span>
            <span className="text-white">FastAPI + SQLite</span>
          </div>
          <div className="flex justify-between">
            <span>Map</span>
            <span className="text-white">OpenStreetMap (Free)</span>
          </div>
          <div className="flex justify-between">
            <span>Weather</span>
            <span className="text-white">Open-Meteo (Free)</span>
          </div>
          <div className="flex justify-between">
            <span>AI</span>
            <span className="text-white">Demo mode (Gemini-ready)</span>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-yellow-300">
            SafeRoute is a demonstration prototype built for a Swiggy Growth internship assessment. 
            Not affiliated with Swiggy Ltd.
          </p>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        <Save className="w-4 h-4" />
        Save Settings (Demo)
      </button>
    </div>
  );
}

