import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Filter, RefreshCw, AlertTriangle, Layers, MapPin, Navigation, ThumbsUp, CheckCircle2, X, Route } from 'lucide-react';
import { useHazards } from '../hooks/useHazards';
import { hazardApi } from '../services/api';
import { HAZARD_CATEGORIES, HAZARD_SEVERITIES, formatTimeAgo, DEFAULT_LOCATION } from '../utils/constants';
import HazardCard from '../components/HazardCard';

// Fix default icon issue with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createHazardIcon(category, severity) {
  const cat = HAZARD_CATEGORIES[category] || HAZARD_CATEGORIES.other;
  const sev = HAZARD_SEVERITIES[severity] || HAZARD_SEVERITIES.medium;
  const size = severity === 'critical' ? 44 : severity === 'high' ? 40 : 36;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${cat.color};
        border:3px solid ${sev.dotColor};
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:${size * 0.45}px;
        box-shadow:0 4px 15px rgba(0,0,0,0.5),0 0 0 2px ${cat.color}40;
        cursor:pointer;
        transition:transform 0.2s;
      ">${cat.emoji}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 5)],
  });
}

function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14, { duration: 1 });
  }, [position, map]);
  return null;
}

const ALL_CATEGORIES = [
  { value: '', label: 'All Categories' },
  ...Object.entries(HAZARD_CATEGORIES).map(([value, { label, emoji }]) => ({
    value, label: `${emoji} ${label}`
  }))
];

export default function SafetyMap() {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [showList, setShowList] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const mapRef = useRef(null);

  const params = {};
  if (filterCategory) params.category = filterCategory;
  if (filterStatus) params.status = filterStatus;
  params.page_size = 100;

  const { hazards, loading, refetch } = useHazards(params);

  const handleHazardClick = (hazard) => {
    setSelectedHazard(hazard);
    setFlyTo([hazard.latitude, hazard.longitude]);
  };

  const handleVerify = async (hazardId, action) => {
    if (verifying) return;
    setVerifying(true);
    try {
      const { data } = await hazardApi.verify(hazardId, action);
      // Update selected hazard if active
      if (selectedHazard && selectedHazard.id === hazardId) {
        setSelectedHazard(data);
      }
      await refetch();
    } catch (err) {
      console.error('Failed to verify hazard', err);
    } finally {
      setVerifying(false);
    }
  };

  // Parse detour coordinates safely if available
  let detourCoords = null;
  if (selectedHazard?.detour_coords) {
    try {
      detourCoords = JSON.parse(selectedHazard.detour_coords);
    } catch {
      detourCoords = null;
    }
  }

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">

      {/* Sidebar panel */}
      <div className={`${showList ? 'w-80' : 'w-0'} shrink-0 bg-navy-900 border-r border-white/5 flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-swiggy-orange" />
              Hazard Reports
              <span className="badge badge-orange ml-1">{hazards.length}</span>
            </h2>
            <button onClick={refetch} className="text-gray-400 hover:text-white transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="select-field text-sm py-2"
            >
              {ALL_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="select-field text-sm py-2"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse h-24" />
            ))
          ) : hazards.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hazards found</p>
            </div>
          ) : (
            hazards.map(hazard => (
              <div
                key={hazard.id}
                onClick={() => handleHazardClick(hazard)}
                className={`transition-all duration-200 ${selectedHazard?.id === hazard.id ? 'ring-2 ring-swiggy-orange rounded-2xl' : ''}`}
              >
                <HazardCard hazard={hazard} compact onVerify={handleVerify} />
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-white/5">
          <p className="text-xs text-gray-500 text-center">
            🗺️ OpenStreetMap · Community Verified
          </p>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative">

        {/* Toggle panel button */}
        <button
          onClick={() => setShowList(p => !p)}
          className="absolute top-4 left-4 z-[1000] bg-navy-800/90 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white p-2.5 rounded-xl shadow-lg transition-all"
          title="Toggle Hazard List"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Legend */}
        <div className="absolute top-4 right-4 z-[1000] bg-navy-800/90 backdrop-blur-sm border border-white/10 rounded-xl p-3 shadow-xl">
          <p className="text-xs font-semibold text-gray-300 mb-2">Map Legend</p>
          <div className="space-y-1.5 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block" />
              <span>Safe Detour Route</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 border-t-2 border-dashed border-red-500 inline-block" />
              <span>Blocked Path</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌊</span>
              <span>Flooding/Waterlogging</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🚧</span>
              <span>Roadblock</span>
            </div>
          </div>
        </div>

        {/* Alternative Route Detour Drawer */}
        {selectedHazard && detourCoords && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-lg bg-navy-900/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 shadow-2xl animate-slide-up">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Route className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Illustrative Detour Preview</span>
                    <span className="badge bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px]">Demo Path</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{selectedHazard.detour_name}</h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                    ⏱️ Estimated Impact: {selectedHazard.detour_est_time}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 leading-tight">
                    ⚠️ Illustrative sample detour for assessment demo. Always verify live ground conditions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHazard(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                title="Dismiss Route Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Map */}
        <MapContainer
          center={[DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          ref={mapRef}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {flyTo && <FlyToMarker position={flyTo} />}

          {/* Draw Alternative Route Detour Polyline (Green) */}
          {selectedHazard && detourCoords && (
            <>
              {/* Blocked direct line through hazard in red dashed */}
              <Polyline
                positions={[
                  detourCoords[0],
                  [selectedHazard.latitude, selectedHazard.longitude],
                  detourCoords[detourCoords.length - 1],
                ]}
                pathOptions={{ color: '#ef4444', weight: 4, dashArray: '6, 8', opacity: 0.8 }}
              />
              {/* Recommended safe alternative detour in solid green with glow */}
              <Polyline
                positions={detourCoords}
                pathOptions={{ color: '#10b981', weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
              />
            </>
          )}

          {hazards.map(hazard => (
            <Marker
              key={hazard.id}
              position={[hazard.latitude, hazard.longitude]}
              icon={createHazardIcon(hazard.category, hazard.severity)}
              eventHandlers={{ click: () => setSelectedHazard(hazard) }}
            >
              <Popup>
                <div className="min-w-[240px] text-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{HAZARD_CATEGORIES[hazard.category]?.emoji || '⚠️'}</span>
                    <div>
                      <p className="font-bold text-sm text-white leading-tight">{hazard.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {hazard.is_demo === 1 && (
                          <span className="text-[10px] text-yellow-400 font-bold">DEMO DATA</span>
                        )}
                        {(hazard.confirmations || 0) >= 3 && (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Verified ({hazard.confirmations})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 mb-2 leading-relaxed">{hazard.description}</p>

                  <div className="flex flex-wrap gap-1 text-xs mb-2">
                    <span className="px-2 py-0.5 bg-white/10 rounded-full text-gray-300">
                      {HAZARD_CATEGORIES[hazard.category]?.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${
                      hazard.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                      hazard.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                      hazard.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-green-500/30 text-green-300'
                    }`}>
                      {hazard.severity}
                    </span>
                  </div>

                  {hazard.detour_name && (
                    <div className="p-2 mb-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs">
                      <p className="font-semibold text-emerald-300 flex items-center gap-1">
                        <Route className="w-3.5 h-3.5" /> Detour Available
                      </p>
                      <p className="text-emerald-400/90 text-[11px] mt-0.5">{hazard.detour_est_time}</p>
                    </div>
                  )}

                  {hazard.location_name && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                      <Navigation className="w-3 h-3 inline text-gray-400" /> {hazard.location_name}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-500 mb-3">{formatTimeAgo(hazard.created_at)}</p>

                  {/* Rider Community Verification Actions */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-gray-400 font-medium">Is this still here?</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleVerify(hazard.id, 'still_there')}
                        className="px-2 py-1 bg-swiggy-orange/20 hover:bg-swiggy-orange/30 border border-swiggy-orange/30 text-[11px] text-swiggy-orange rounded-md flex items-center gap-1 transition-all active:scale-95"
                        title="Confirm hazard is still active"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Yes ({hazard.confirmations || 1})</span>
                      </button>
                      <button
                        onClick={() => handleVerify(hazard.id, 'cleared')}
                        className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-[11px] text-emerald-300 rounded-md flex items-center gap-1 transition-all active:scale-95"
                        title="Mark as cleared"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Cleared</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
