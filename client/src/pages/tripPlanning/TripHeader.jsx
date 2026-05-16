import { Button } from "@/components/ui/Button";
import { CalendarDays, Save, Share2, Lock, Check, Copy, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/features/auth/authAPI";

// ─── Share Modal ──────────────────────────────────────────────────────────────
const ShareModal = ({ trip }) => {
  const [open,      setOpen]      = useState(false);
  const [shareUrl,  setShareUrl]  = useState(trip.isPublic && trip.shareToken
    ? `${window.location.origin}/shared/${trip.shareToken}` : "");
  const [isShared,  setIsShared]  = useState(!!trip.isPublic);
  const [loading,   setLoading]   = useState(false);
  const [copied,    setCopied]    = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/api/trips/${trip._id}/share`);
      setShareUrl(res.data.shareUrl);
      setIsShared(true);
      toast.success("Share link created!");
    } catch {
      toast.error("Failed to create share link.");
    } finally { setLoading(false); }
  };

  const revoke = async () => {
    setLoading(true);
    try {
      await api.post(`/api/trips/${trip._id}/unshare`);
      setShareUrl("");
      setIsShared(false);
      toast.success("Link revoked — trip is now private.");
    } catch {
      toast.error("Failed to revoke link.");
    } finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-3xl flex gap-1">
          <Share2 size={15} />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 size={18} />
            Share this trip
          </DialogTitle>
        </DialogHeader>

        <div style={{ padding: "4px 0 8px" }}>
          {/* Status indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            borderRadius: 10, marginBottom: 20,
            background: isShared ? "#ECFDF5" : "#F9FAFB",
            border: `1px solid ${isShared ? "#6EE7B7" : "#E5E7EB"}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isShared ? "#10B981" : "#9CA3AF",
              boxShadow: isShared ? "0 0 0 3px rgba(16,185,129,.2)" : "none",
            }} />
            <span style={{ fontSize: 14, color: isShared ? "#065F46" : "#6B7280", fontWeight: 500 }}>
              {isShared ? "Anyone with the link can view this trip" : "This trip is private"}
            </span>
          </div>

          {/* URL box */}
          {isShared && shareUrl && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase" }}>Share link</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  readOnly
                  value={shareUrl}
                  style={{
                    flex: 1, padding: "9px 12px", borderRadius: 8,
                    border: "1.5px solid #E5E7EB", fontSize: 13,
                    color: "#374151", background: "#F9FAFB",
                    fontFamily: "monospace", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}
                />
                <button onClick={copy} style={{
                  padding: "9px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB",
                  background: copied ? "#ECFDF5" : "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 13, fontWeight: 500,
                  color: copied ? "#065F46" : "#374151",
                  transition: "all .2s",
                }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {/* What viewers can see */}
          <div style={{ background: "#F8FAFF", border: "1px solid #E0E7FF", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#3730A3", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: ".05em" }}>Viewers can see</p>
            {["Itinerary & day-by-day activities", "Trip destination & dates", "Notes"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, fontSize: 13, color: "#374151" }}>
                <Check size={13} color="#6366F1" strokeWidth={2.5} /> {item}
              </div>
            ))}
            <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #E0E7FF" }}>
              {["Budget details", "Private notes"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, fontSize: 13, color: "#9CA3AF" }}>
                  <X size={13} color="#D1D5DB" strokeWidth={2.5} /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {!isShared ? (
              <button onClick={generate} disabled={loading} style={{
                flex: 1, padding: "11px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg,#2B4FD8,#1535b0)",
                color: "#fff", fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? .7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              }}>
                <Share2 size={15} />
                {loading ? "Creating link…" : "Create share link"}
              </button>
            ) : (
              <button onClick={revoke} disabled={loading} style={{
                flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #FCA5A5",
                background: "#FEF2F2", color: "#DC2626", fontWeight: 600, fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              }}>
                <Lock size={15} />
                {loading ? "Revoking…" : "Make private again"}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── TripHeader ───────────────────────────────────────────────────────────────
const TripHeader = ({ trip, onSave, onDatesChange }) => {
  const [startDate, setStartDate] = useState(trip.startDate || "");
  const [endDate,   setEndDate]   = useState(trip.endDate   || "");

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h1 className="text-2xl font-semibold">Trip to {trip.destination.city}</h1>
        {trip.destination.country && (
          <p className="text-sm text-gray-500">{trip.destination.city}, {trip.destination.country}</p>
        )}
      </div>

      <div className="flex gap-2">
        {/* Dates */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-3xl flex gap-1">
              <CalendarDays size={16} /> Dates
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Select Trip Dates</DialogTitle></DialogHeader>
            <input type="date" value={startDate?.slice(0, 10)}
              onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" />
            <input type="date" value={endDate?.slice(0, 10)}
              onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" />
            <Button className="mt-3" onClick={() => { onDatesChange({ startDate, endDate }); toast.success("Trip dates updated"); }}>
              Save Dates
            </Button>
          </DialogContent>
        </Dialog>

        {/* Share */}
        <ShareModal trip={trip} />

        {/* Save */}
        <Button onClick={onSave} className="bg-sky-600 text-white rounded-3xl">
          <Save size={16} /> Save
        </Button>
      </div>
    </div>
  );
};

export default TripHeader;