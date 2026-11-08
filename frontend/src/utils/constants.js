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

