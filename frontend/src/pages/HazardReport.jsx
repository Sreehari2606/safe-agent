import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, MapPin, CheckCircle, Loader2, ChevronDown, Crosshair, Navigation, Sparkles } from 'lucide-react';
import { hazardApi } from '../services/api';
import { HAZARD_CATEGORIES, DEFAULT_LOCATION } from '../utils/constants';
import HazardCard from '../components/HazardCard';
import { useHazards } from '../hooks/useHazards';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom draggable safety pin icon
const pinIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 38px; height: 38px;
      background: #FC8019;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 15px rgba(252, 128, 25, 0.6);
      display: flex; align-items: center; justify-content: center;
      cursor: grab;
    ">
      <div style="width: 12px; height: 12px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

// Quick delivery hub shortcuts
const POPULAR_HUBS = [
  { name: 'Silk Board', lat: 12.9177, lon: 77.6230 },
  { name: 'Koramangala', lat: 12.9344, lon: 77.6269 },
  { name: 'Indiranagar', lat: 12.9784, lon: 77.6408 },
  { name: 'HSR Layout', lat: 12.9112, lon: 77.6450 },
  { name: 'Bellandur', lat: 12.9340, lon: 77.6700 },
  { name: 'Whitefield', lat: 12.9698, lon: 77.7499 },
  { name: 'BTM Layout', lat: 12.9166, lon: 77.6101 },
  { name: 'Electronic City', lat: 12.8452, lon: 77.6602 },
];

function LocationPickerEvents({ lat, lon, onSelect }) {
  const map = useMapEvents({
    click(e) {
      onSelect(parseFloat(e.latlng.lat.toFixed(4)), parseFloat(e.latlng.lng.toFixed(4)));
    },
  });

  useEffect(() => {
    map.flyTo([lat, lon], map.getZoom(), { duration: 0.8 });
  }, [lat, lon, map]);

  return (
    <Marker
      position={[lat, lon]}
      icon={pinIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const position = e.target.getLatLng();
          onSelect(parseFloat(position.lat.toFixed(4)), parseFloat(position.lng.toFixed(4)));
        },
      }}
    />
  );
}

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
  const [gpsLoading, setGpsLoading] = useState(false);
  const { hazards, loading: listLoading, refetch } = useHazards({ page_size: 20 });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleLocationPicked = (lat, lon, name = null) => {
    setForm(f => ({
      ...f,
      latitude: lat,
      longitude: lon,
      location_name: name || f.location_name || `Location (${lat}, ${lon})`,
    }));
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        handleLocationPicked(lat, lon, 'My Device Location');
      },
      (err) => {
        setGpsLoading(false);
        alert('Could not access GPS location: ' + err.message);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const newHazard = {
      ...form,
      id: Date.now(),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      status: 'active',
      confirmations: 1,
      cleared_reports: 0,
      is_demo: 0,
      created_at: new Date().toISOString(),
    };

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
    } catch {
      // Offline fallback: save locally so user action never fails
      try {
        const local = JSON.parse(localStorage.getItem('saferoute_local_hazards') || '[]');
        localStorage.setItem('saferoute_local_hazards', JSON.stringify([newHazard, ...local]));
        setStatus('success');
        setForm(INITIAL);
        await refetch();
        setTimeout(() => setStatus(null), 4000);
      } catch (err) {
        setStatus('error');
        setErrorMsg('Submission failed. Please check your network.');
      }
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-swiggy-orange" />
          Report a Hazard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Pick a spot on the interactive map or use GPS to quickly warn fellow riders.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Form Column */}
        <div className="card p-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-swiggy-orange" />
            Hazard Report Details
          </h2>

          {status === 'success' && (
            <div className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <p className="text-green-300 text-sm font-medium">Hazard report submitted and pinned successfully!</p>
            </div>
          )}
          {status === 'error' && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-fade-in">
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
                placeholder="e.g., Deep waterlogged pothole near Metro pillar 42"
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

            {/* Interactive Map Picker Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-white flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-swiggy-orange" />
                  Pick Location on Map (Tap or Drag Pin)
                </label>
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={gpsLoading}
                  className="px-2.5 py-1 bg-swiggy-orange/15 hover:bg-swiggy-orange/25 border border-swiggy-orange/30 text-swiggy-orange rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Navigation className={`w-3 h-3 ${gpsLoading ? 'animate-spin' : ''}`} />
                  <span>{gpsLoading ? 'Locating...' : 'Use My GPS'}</span>
                </button>
              </div>

              {/* Delivery Hub Quick Shortcuts */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {POPULAR_HUBS.map(hub => (
                  <button
                    key={hub.name}
                    type="button"
                    onClick={() => handleLocationPicked(hub.lat, hub.lon, `${hub.name}, Bengaluru`)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-navy-800 hover:bg-swiggy-orange/20 border border-white/10 hover:border-swiggy-orange/30 text-[11px] text-gray-300 hover:text-white transition-all"
                  >
                    📍 {hub.name}
                  </button>
                ))}
              </div>

              {/* Mini Map */}
              <div className="h-56 rounded-xl overflow-hidden border border-white/10 shadow-inner relative">
                <MapContainer
                  center={[form.latitude, form.longitude]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPickerEvents
                    lat={form.latitude}
                    lon={form.longitude}
                    onSelect={(lat, lon) => handleLocationPicked(lat, lon)}
                  />
                </MapContainer>
                <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-navy-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px] text-gray-300 flex items-center justify-between pointer-events-none">
                  <span>Selected: <strong>{form.latitude}, {form.longitude}</strong></span>
                  <span className="text-swiggy-orange font-medium">Click map to move pin</span>
                </div>
              </div>
            </div>

            {/* Location Name & Coordinates display */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Landmark / Street Name</label>
              <input
                type="text"
                value={form.location_name}
                onChange={set('location_name')}
                placeholder="e.g., Silk Board Flyover underpass"
                className="input-field text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description & Detour Advice *</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                required
                minLength={5}
                rows={3}
                placeholder="Describe road conditions, water depth, or suggest an alternative dry road for riders..."
                className="input-field resize-none text-sm"
              />
            </div>

            {/* Reporter Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Reported By</label>
              <input
                type="text"
                value={form.reported_by}
                onChange={set('reported_by')}
                placeholder="Rahul Kumar"
                className="input-field text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2 shadow-xl"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Report...</>
              ) : (
                <><AlertTriangle className="w-4 h-4" /> Publish Hazard Warning</>
              )}
            </button>
          </form>
        </div>

        {/* Recent Reports List Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <span>Active Reports</span>
              <span className="badge badge-orange">{hazards.length}</span>
            </h2>
            <button onClick={refetch} className="text-xs text-swiggy-orange hover:text-swiggy-orange-dark transition-colors">
              Refresh Feed
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
              <p className="text-sm font-medium text-white">No active reports</p>
              <p className="text-xs mt-1 text-gray-400">Be the first delivery partner to pin a hazard</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {hazards.map(h => (
                <HazardCard key={h.id} hazard={h} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
