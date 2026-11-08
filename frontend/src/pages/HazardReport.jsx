import { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle, Loader2, ChevronDown } from 'lucide-react';
import { hazardApi } from '../services/api';
import { HAZARD_CATEGORIES, DEFAULT_LOCATION } from '../utils/constants';
import HazardCard from '../components/HazardCard';
import { useHazards } from '../hooks/useHazards';

const INITIAL = {
  title: '', description: '',
  category: 'roadblock', severity: 'medium',
  latitude: DEFAULT_LOCATION.lat, longitude: DEFAULT_LOCATION.lon,
  location_name: '', reported_by: 'Rahul Kumar',
};

export default function HazardReport() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const { hazards, loading: listLoading, refetch } = useHazards({ page_size: 20 });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await hazardApi.create({
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      });
      setStatus('success');
      setForm(INITIAL);
      await refetch();
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.response?.data?.detail || err.message || 'Submission failed');
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-swiggy-orange" />
          Report a Hazard
        </h1>
        <p className="text-gray-400 text-sm mt-1">Help fellow delivery partners by reporting road hazards in your area.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Form */}
        <div className="card p-6">
          <h2 className="font-bold text-white mb-5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-swiggy-orange" />
            Hazard Details
          </h2>

          {status === 'success' && (
            <div className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <p className="text-green-300 text-sm font-medium">Hazard reported successfully!</p>
            </div>
          )}
          {status === 'error' && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Hazard Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={set('title')}
                required
                minLength={3}
                placeholder="e.g., Deep pothole near Metro station"
                className="input-field"
              />
            </div>

            {/* Category & Severity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category *</label>
                <div className="relative">
                  <select value={form.category} onChange={set('category')} className="select-field pr-10">
                    {Object.entries(HAZARD_CATEGORIES).map(([value, { label, emoji }]) => (
                      <option key={value} value={value}>{emoji} {label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Severity *</label>
                <div className="relative">
                  <select value={form.severity} onChange={set('severity')} className="select-field pr-10">
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                required
                minLength={5}
                rows={4}
                placeholder="Describe the hazard in detail – location landmarks, extent, any alternative routes..."
                className="input-field resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Location Name</label>
              <input
                type="text"
                value={form.location_name}
                onChange={set('location_name')}
                placeholder="e.g., Silk Board Flyover, Bengaluru"
                className="input-field"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={set('latitude')}
                  required
                  min="-90" max="90"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={set('longitude')}
                  required
                  min="-180" max="180"
                  className="input-field"
                />
              </div>
            </div>

            {/* Reported by */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Your Name</label>
              <input
                type="text"
                value={form.reported_by}
                onChange={set('reported_by')}
                placeholder="Anonymous"
                className="input-field"
              />
            </div>

            {/* Map hint */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-300">
                📍 <strong>Tip:</strong> Default coordinates are set to Bengaluru. For precise location,
                use Google Maps → right-click → Copy coordinates.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <><AlertTriangle className="w-4 h-4" /> Submit Hazard Report</>
              )}
            </button>
          </form>
        </div>

        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">All Reports ({hazards.length})</h2>
            <button onClick={refetch} className="text-xs text-swiggy-orange hover:text-swiggy-orange-dark transition-colors">
              Refresh
            </button>
          </div>

          {listLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : hazards.length === 0 ? (
            <div className="card p-10 text-center text-gray-500">
              <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No reports yet</p>
              <p className="text-xs mt-1">Be the first to report a hazard</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {hazards.map(h => <HazardCard key={h.id} hazard={h} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

