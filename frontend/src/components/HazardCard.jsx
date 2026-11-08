import { HAZARD_CATEGORIES, HAZARD_SEVERITIES, HAZARD_STATUSES, formatTimeAgo } from '../utils/constants';
import { MapPin, Clock, User, CheckCircle2, ThumbsUp, Navigation } from 'lucide-react';

export default function HazardCard({ hazard, onClick, onVerify, compact = false }) {
  const cat = HAZARD_CATEGORIES[hazard.category] || HAZARD_CATEGORIES.other;
  const sev = HAZARD_SEVERITIES[hazard.severity] || HAZARD_SEVERITIES.medium;
  const status = HAZARD_STATUSES[hazard.status] || HAZARD_STATUSES.active;
  const isVerified = (hazard.confirmations || 0) >= 3;

  return (
    <div
      className={`card p-4 cursor-pointer hover:border-white/20 transition-all duration-200 ${onClick ? 'hover:scale-[1.01]' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: cat.color + '20', border: `1px solid ${cat.color}30` }}
        >
          {cat.emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white leading-tight truncate flex-1">
              {hazard.title}
            </h3>
            {hazard.is_demo === 1 && (
              <span className="demo-label shrink-0">DEMO</span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`badge badge-${sev.color}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sev.dotColor }} />
              {sev.label}
            </span>
            <span className={`badge badge-${status.color}`}>
              {status.label}
            </span>
            <span
              className="badge"
              style={{ backgroundColor: cat.color + '20', color: cat.color, border: `1px solid ${cat.color}30` }}
            >
              {cat.label}
            </span>
            {isVerified && (
              <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified ({hazard.confirmations})
              </span>
            )}
          </div>

          {/* Description */}
          {!compact && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{hazard.description}</p>
          )}

          {/* Detour suggestion badge if available */}
          {hazard.detour_name && (
            <div className="mt-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0 text-xs">
                <span className="text-emerald-300 font-medium truncate block">{hazard.detour_name}</span>
                <span className="text-emerald-400/80 text-[11px] font-semibold">{hazard.detour_est_time}</span>
              </div>
            </div>
          )}

          {/* Meta & Verification Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-3">
              {hazard.location_name && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[140px]">{hazard.location_name}</span>
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(hazard.created_at)}
              </span>
            </div>

            {onVerify && (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  title="Confirm hazard is still present"
                  onClick={() => onVerify(hazard.id, 'still_there')}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-swiggy-orange/20 border border-white/10 hover:border-swiggy-orange/30 text-[11px] text-gray-300 hover:text-white transition-all flex items-center gap-1 active:scale-95"
                >
                  <ThumbsUp className="w-3 h-3 text-swiggy-orange" />
                  <span>{hazard.confirmations || 1}</span>
                </button>
                <button
                  type="button"
                  title="Report hazard cleared"
                  onClick={() => onVerify(hazard.id, 'cleared')}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-[11px] text-gray-400 hover:text-emerald-300 transition-all flex items-center gap-1 active:scale-95"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Cleared {hazard.cleared_reports ? `(${hazard.cleared_reports})` : ''}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

