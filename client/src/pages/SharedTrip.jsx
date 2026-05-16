import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, Clock, AlertCircle, Plane } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const TYPE_META = {
  sightseeing: { emoji: "🏛️", bg: "#EFF6FF", text: "#1D4ED8" },
  food:        { emoji: "🍜", bg: "#FFFBEB", text: "#B45309" },
  adventure:   { emoji: "🧗", bg: "#F0FDF4", text: "#166534" },
  shopping:    { emoji: "🛍️", bg: "#FDF2F8", text: "#9D174D" },
  relaxation:  { emoji: "🧘", bg: "#F5F3FF", text: "#6D28D9" },
  culture:     { emoji: "🎭", bg: "#FFF7ED", text: "#C2410C" },
  dining:      { emoji: "🍽️", bg: "#FEF2F2", text: "#B91C1C" },
  transport:   { emoji: "🚌", bg: "#F9FAFB", text: "#4B5563" },
};
const getMeta = (type) => TYPE_META[type] || TYPE_META.sightseeing;

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:wght@400;600&display=swap');
.st-root { min-height:100vh; background:#F7F7F5; font-family:'DM Sans',sans-serif; }
.st-hero { background:linear-gradient(160deg,#0f172a 0%,#1e3a8a 60%,#1d4ed8 100%); padding:60px 24px 80px; text-align:center; position:relative; overflow:hidden; }
.st-hero::before { content:''; position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=60') center/cover; opacity:.18; }
.st-hero-content { position:relative; z-index:1; max-width:680px; margin:0 auto; }
.st-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); borderRadius:99px; padding:5px 14px; font-size:12px; color:rgba(255,255,255,.8); margin-bottom:20px; backdrop-filter:blur(8px); border-radius:99px; }
.st-city { font-family:'Cormorant Garamond',serif; font-size:clamp(42px,8vw,72px); font-weight:600; color:#fff; line-height:1.05; margin:0 0 10px; }
.st-meta { display:flex; align-items:center; justify-content:center; gap:20px; flex-wrap:wrap; margin-top:18px; }
.st-meta-item { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,.7); font-size:14px; }
.st-body { max-width:760px; margin:-32px auto 0; padding:0 20px 60px; position:relative; z-index:2; }
.st-day-card { background:#fff; border-radius:16px; border:1px solid #F0F0EE; margin-bottom:16px; overflow:hidden; box-shadow:0 1px 6px rgba(0,0,0,.05); }
.st-day-header { display:flex; align-items:center; gap:12px; padding:16px 20px; border-bottom:1px solid #F9F9F7; }
.st-day-num { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#2B4FD8,#1535b0); color:#fff; font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.st-day-title { font-size:15px; font-weight:600; color:#111827; }
.st-day-count { font-size:12px; color:#9CA3AF; }
.st-activity { display:flex; align-items:center; gap:12px; padding:12px 20px; border-bottom:1px solid #FAFAF9; }
.st-activity:last-child { border-bottom:none; }
.st-act-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
.st-act-name { flex:1; font-size:14px; color:#374151; font-weight:500; }
.st-act-time { display:flex; align-items:center; gap:4px; font-size:12px; color:#9CA3AF; flex-shrink:0; }
.st-notes-card { background:#fff; border-radius:16px; border:1px solid #F0F0EE; padding:20px; margin-bottom:16px; box-shadow:0 1px 6px rgba(0,0,0,.05); }
.st-section-label { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#9CA3AF; margin-bottom:12px; }
.st-footer { text-align:center; padding:32px 20px; border-top:1px solid #EBEBEB; margin-top:12px; }
.st-cta-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:10px; background:linear-gradient(135deg,#2B4FD8,#1535b0); color:#fff; font-size:14px; font-weight:600; text-decoration:none; box-shadow:0 4px 14px rgba(43,79,216,.3); transition:transform .15s,box-shadow .15s; }
.st-cta-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(43,79,216,.38); }
.st-empty { text-align:center; padding:32px 20px; color:#9CA3AF; font-size:14px; }
`;

export default function SharedTrip() {
  const { token } = useParams();
  const [trip,    setTrip]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/trips/shared/${token}`);
        setTrip(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "This trip link is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", color: "#6B7280" }}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#2B4FD8", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 14px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        Loading trip…
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", padding: 24 }}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center", maxWidth: 380 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <AlertCircle size={28} color="#DC2626" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>Trip not found</h2>
        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>{error}</p>
        <Link to="/" className="st-cta-btn">← Back to PathCrafters</Link>
      </div>
    </div>
  );

  const totalActivities = trip.days?.reduce((s, d) => s + (d.activities?.length || 0), 0) || 0;

  return (
    <div className="st-root">
      <style>{CSS}</style>

      {/* Hero */}
      <div className="st-hero">
        <div className="st-hero-content">
          <div className="st-badge">
            <Plane size={12} />
            Shared trip itinerary
          </div>
          <h1 className="st-city">{trip.destination?.city}</h1>
          {trip.destination?.country && (
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 16, margin: 0 }}>{trip.destination.country}</p>
          )}
          <div className="st-meta">
            {(trip.startDate || trip.endDate) && (
              <span className="st-meta-item">
                <Calendar size={14} />
                {fmt(trip.startDate)}{trip.endDate ? ` → ${fmt(trip.endDate)}` : ""}
              </span>
            )}
            <span className="st-meta-item">
              <MapPin size={14} />
              {trip.days?.length || 0} days planned
            </span>
            <span className="st-meta-item">
              ✅ {totalActivities} activities
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="st-body">

        {/* Itinerary */}
        {trip.days?.length > 0 ? (
          <>
            <p className="st-section-label" style={{ marginTop: 28 }}>Itinerary</p>
            {trip.days.map((day) => {
              const meta = getMeta(day.activities?.[0]?.type);
              return (
                <div key={day.dayNumber} className="st-day-card">
                  <div className="st-day-header">
                    <div className="st-day-num">D{day.dayNumber}</div>
                    <div>
                      <div className="st-day-title">Day {day.dayNumber}</div>
                      <div className="st-day-count">{day.activities?.length || 0} activities</div>
                    </div>
                  </div>
                  {day.activities?.length > 0 ? day.activities.map((act, i) => {
                    const m = getMeta(act.type);
                    return (
                      <div key={i} className="st-activity">
                        <div className="st-act-icon" style={{ background: m.bg }}>
                          {m.emoji}
                        </div>
                        <span className="st-act-name">{act.name}</span>
                        {act.time && (
                          <span className="st-act-time">
                            <Clock size={12} /> {act.time}
                          </span>
                        )}
                      </div>
                    );
                  }) : (
                    <p className="st-empty">No activities planned for this day.</p>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="st-empty" style={{ marginTop: 28 }}>No itinerary added yet.</div>
        )}

        {/* Notes */}
        {trip.notes && (
          <>
            <p className="st-section-label" style={{ marginTop: 24 }}>Notes</p>
            <div className="st-notes-card">
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{trip.notes}</p>
            </div>
          </>
        )}

        {/* CTA footer */}
        <div className="st-footer">
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
            Inspired? Plan your own trip with AI on PathCrafters.
          </p>
          <Link to="/signup" className="st-cta-btn">
            <Plane size={15} />
            Start planning for free
          </Link>
        </div>
      </div>
    </div>
  );
}