// Hazard category metadata
export const HAZARD_CATEGORIES = {
  flooding: { label: 'Flooding', emoji: '🌊', color: '#3b82f6', bgColor: '#1d4ed8', tailwind: 'blue' },
  roadblock: { label: 'Road Block', emoji: '🚧', color: '#f59e0b', bgColor: '#d97706', tailwind: 'yellow' },
  poor_lighting: { label: 'Poor Lighting', emoji: '💡', color: '#8b5cf6', bgColor: '#7c3aed', tailwind: 'purple' },
  accident: { label: 'Accident', emoji: '🚗', color: '#ef4444', bgColor: '#dc2626', tailwind: 'red' },
  construction: { label: 'Construction', emoji: '🏗️', color: '#f97316', bgColor: '#ea580c', tailwind: 'orange' },
  waterlogging: { label: 'Waterlogging', emoji: '💧', color: '#06b6d4', bgColor: '#0891b2', tailwind: 'cyan' },
  other: { label: 'Other', emoji: '⚠️', color: '#6b7280', bgColor: '#4b5563', tailwind: 'gray' },
};

export const HAZARD_SEVERITIES = {
  low: { label: 'Low', color: 'green', dotColor: '#22c55e' },
  medium: { label: 'Medium', color: 'yellow', dotColor: '#f59e0b' },
  high: { label: 'High', color: 'orange', dotColor: '#f97316' },
  critical: { label: 'Critical', color: 'red', dotColor: '#ef4444' },
};

export const HAZARD_STATUSES = {
  active: { label: 'Active', color: 'red' },
  under_review: { label: 'Under Review', color: 'yellow' },
  resolved: { label: 'Resolved', color: 'green' },
};

export const DEFAULT_HAZARDS = [
  {
    id: 1,
    title: "Severe Waterlogging – Silk Board Junction",
    description: "Road completely submerged after overnight rain. Water depth ~30 cm. Avoid using this route.",
    category: "waterlogging",
    severity: "critical",
    status: "active",
    latitude: 12.9177,
    longitude: 77.6230,
    location_name: "Silk Board Junction, Bengaluru",
    reported_by: "SafeRoute Demo",
    is_demo: 1,
    confirmations: 9,
    cleared_reports: 0,
    detour_name: "Detour via Outer Ring Road Elevated & BTM 2nd Stage",
    detour_est_time: "+6 mins (100% dry)",
    detour_coords: "[[12.9140,77.6180],[12.9160,77.6150],[12.9210,77.6170],[12.9220,77.6240]]",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 2,
    title: "Road Blocked – Koramangala 5th Block",
    description: "Utility road repair in progress. Expect 2 km detour. Use 80 Feet Road as alternative.",
    category: "roadblock",
    severity: "medium",
    status: "active",
    latitude: 12.9344,
    longitude: 77.6269,
    location_name: "Koramangala 5th Block, Bengaluru",
    reported_by: "SafeRoute Demo",
    is_demo: 1,
    confirmations: 6,
    cleared_reports: 1,
    detour_name: "Detour via 80 Feet Road & 100 Feet Ring Road",
    detour_est_time: "+4 mins (smooth traffic)",
    detour_coords: "[[12.9310,77.6220],[12.9350,77.6210],[12.9380,77.6250],[12.9360,77.6310]]",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 3,
    title: "Poor Lighting – HSR Layout Sector 2",
    description: "Streetlights non-functional on this stretch. Exercise caution during night deliveries.",
    category: "poor_lighting",
    severity: "medium",
    status: "active",
    latitude: 12.9112,
    longitude: 77.6450,
    location_name: "HSR Layout Sector 2, Bengaluru",
    reported_by: "SafeRoute Demo",
    is_demo: 1,
    confirmations: 4,
    cleared_reports: 0,
    detour_name: "Detour via 27th Main Well-Lit Commercial Street",
    detour_est_time: "+2 mins (fully illuminated)",
    detour_coords: "[[12.9090,77.6420],[12.9120,77.6410],[12.9140,77.6460]]",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 4,
    title: "Flooding – Bellandur Lake Road",
    description: "Lake overflow has flooded adjacent road. Do not attempt crossing. Use Sarjapur Road instead.",
    category: "flooding",
    severity: "high",
    status: "active",
    latitude: 12.9340,
    longitude: 77.6700,
    location_name: "Bellandur Lake Road, Bengaluru",
    reported_by: "SafeRoute Demo",
    is_demo: 1,
    confirmations: 8,
    cleared_reports: 0,
    detour_name: "Detour via Sarjapur Main Road & Doddakannelli",
    detour_est_time: "+7 mins (elevated high ground)",
    detour_coords: "[[12.9280,77.6650],[12.9310,77.6780],[12.9370,77.6760]]",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 5,
    title: "Construction Zone – Whitefield Main Road",
    description: "Metro rail construction narrows road to single lane. High congestion 8 AM – 10 PM.",
    category: "construction",
    severity: "low",
    status: "active",
    latitude: 12.9698,
    longitude: 77.7499,
    location_name: "Whitefield Main Road, Bengaluru",
    reported_by: "SafeRoute Demo",
    is_demo: 1,
    confirmations: 3,
    cleared_reports: 0,
    detour_name: "Detour via ITPL Back Road",
    detour_est_time: "+3 mins (less congestion)",
    detour_coords: "[[12.9670,77.7450],[12.9710,77.7440],[12.9730,77.7510]]",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 6,
    title: "Minor Accident – Indiranagar 100 Feet Road",
    description: "Vehicle collision cleared but road is slippery with oil spill. Slow down.",
    category: "accident",
    severity: "medium",
    status: "under_review",
    latitude: 12.9784,
    longitude: 77.6408,
    location_name: "Indiranagar 100 Feet Road, Bengaluru",
    reported_by: "SafeRoute Demo",
    is_demo: 1,
    confirmations: 2,
    cleared_reports: 1,
    detour_name: "Detour via 12th Main Road",
    detour_est_time: "+2 mins (clear surface)",
    detour_coords: "[[12.9750,77.6380],[12.9800,77.6390]]",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

export const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const DEFAULT_LOCATION = {
  lat: parseFloat(import.meta.env.VITE_DEFAULT_LAT || '12.9716'),
  lon: parseFloat(import.meta.env.VITE_DEFAULT_LON || '77.5946'),
  name: 'Bengaluru, Karnataka',
};
