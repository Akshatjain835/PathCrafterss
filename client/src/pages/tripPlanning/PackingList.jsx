import { useState } from "react";
import api from "@/features/auth/authAPI";
import { toast } from "sonner";
import { Sparkles, Package, ChevronDown, ChevronUp, RotateCcw, Download, CheckCircle2 } from "lucide-react";

// ─── tiny inline styles so zero extra CSS files needed ───────────────────────
const S = {
  wrap:       { padding: "32px 28px", fontFamily: "'DM Sans', sans-serif", maxWidth: 900 },
  header:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 },
  title:      { fontSize: 22, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 9, margin: 0 },
  subtitle:   { fontSize: 14, color: "#6B7280", margin: "4px 0 0" },
  genBtn:     { display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#2B4FD8,#1535b0)", color: "#fff", fontSize: 14, fontWeight: 600, boxShadow: "0 3px 12px rgba(43,79,216,.28)", transition: "transform .15s, box-shadow .15s", fontFamily: "inherit" },
  genBtnDis:  { opacity: 0.6, cursor: "not-allowed" },

  // empty state
  empty:      { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", border: "2px dashed #E5E7EB", borderRadius: 16, gap: 14, textAlign: "center" },
  emptyIcon:  { width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 17, fontWeight: 600, color: "#374151", margin: 0 },
  emptySub:   { fontSize: 14, color: "#9CA3AF", margin: 0, maxWidth: 280 },

  // loading
  loading:    { display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 20px", gap: 14, color: "#6B7280", fontSize: 15 },
  spinner:    { width: 22, height: 22, border: "2.5px solid #E5E7EB", borderTopColor: "#2B4FD8", borderRadius: "50%", animation: "spin .7s linear infinite" },

  // stats
  statsRow:   { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 },
  stat:       { background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 12, padding: "12px 20px", flex: "1 1 80px" },
  statVal:    { fontSize: 24, fontWeight: 700, color: "#111827", lineHeight: 1 },
  statLbl:    { fontSize: 12, color: "#6B7280", marginTop: 3 },

  // tips
  tips:       { background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", border: "1px solid #FDE68A", borderRadius: 12, padding: "16px 20px", marginBottom: 20 },
  tipsTitle:  { fontSize: 11.5, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "#92400E", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 },
  tip:        { fontSize: 13.5, color: "#78350F", marginBottom: 6, display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.55 },

  // actions
  actionsRow: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  actionBtn:  { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151", fontFamily: "inherit", transition: "all .15s" },

  // grid
  grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 },

  // category card
  cat:        { background: "#fff", border: "1.5px solid #F3F4F6", borderRadius: 14, overflow: "hidden", transition: "border-color .2s, box-shadow .2s" },
  catHeader:  { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", cursor: "pointer", userSelect: "none" },
  catLeft:    { display: "flex", alignItems: "center", gap: 10 },
  catEmoji:   { width: 38, height: 38, borderRadius: 10, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 },
  catName:    { fontSize: 14.5, fontWeight: 600, color: "#111827" },
  catCount:   { fontSize: 12, color: "#9CA3AF", marginTop: 1 },
  progress:   { height: 3, background: "#F3F4F6" },
  progFill:   { height: "100%", background: "linear-gradient(90deg,#2B4FD8,#60A5FA)", transition: "width .4s" },
  items:      { padding: "4px 14px 14px" },

  // item row
  item:       { display: "flex", alignItems: "center", gap: 10, padding: "7px 4px", borderBottom: "1px solid #F9FAFB", cursor: "pointer", borderRadius: 6, transition: "background .12s" },
  checkbox:   { width: 18, height: 18, borderRadius: 5, border: "2px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" },
  checkboxOn: { background: "#2B4FD8", borderColor: "#2B4FD8" },
  itemName:   { fontSize: 13.5, color: "#374151", flex: 1, transition: "color .15s" },
  itemDone:   { textDecoration: "line-through", color: "#9CA3AF" },
  essential:  { fontSize: 10, fontWeight: 600, background: "#FEF2F2", color: "#DC2626", borderRadius: 4, padding: "1px 6px", flexShrink: 0 },
};

const CheckSVG = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function PackingList({ trip }) {
  const [list,      setList]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [checked,   setChecked]   = useState({});      // key: "catIdx-itemIdx"
  const [collapsed, setCollapsed] = useState({});

  const totalItems  = list?.categories?.reduce((s, c) => s + c.items.length, 0) || 0;
  const packedCount = Object.values(checked).filter(Boolean).length;
  const essentials  = list?.categories?.reduce((s, c) => s + c.items.filter((i) => i.essential).length, 0) || 0;
  const pct         = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  const generate = async () => {
    setLoading(true);
    setChecked({});
    setCollapsed({});
    try {
      const res = await api.post("/api/ai/packing-list", {
        destination:  trip.destination,
        numDays:      trip.days?.length || 3,
        travelStyle:  trip.travelStyle  || "balanced",
        days:         trip.days         || [],
        startDate:    trip.startDate    || null,
      });
      setList(res.data);
      toast.success("Packing list ready! ✈️");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (ci, ii) => {
    const key = `${ci}-${ii}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCat = (i) => setCollapsed((prev) => ({ ...prev, [i]: !prev[i] }));

  const exportTxt = () => {
    if (!list) return;
    const lines = [`Packing List — ${trip.destination?.city}\n`];
    list.categories.forEach((cat) => {
      lines.push(`\n${cat.emoji} ${cat.name}`);
      cat.items.forEach((item) => lines.push(`  ${item.essential ? "★ " : "  "}${item.name}`));
    });
    if (list.tips?.length) {
      lines.push("\n💡 Tips");
      list.tips.forEach((t) => lines.push(`  • ${t}`));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `packing-${trip.destination?.city?.toLowerCase().replace(/\s/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={S.wrap}>
      {/* inject keyframe for spinner */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .pl-item:hover{background:#F9FAFB;} .pl-cat:hover{border-color:#E0E7FF!important;box-shadow:0 2px 12px rgba(43,79,216,.06)}`}</style>

      {/* ── Header ── */}
      <div style={S.header}>
        <div>
          <h2 style={S.title}>
            <Package size={20} strokeWidth={2} />
            Packing List
          </h2>
          <p style={S.subtitle}>
            AI-generated based on your itinerary, destination &amp; season
          </p>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          style={{ ...S.genBtn, ...(loading ? S.genBtnDis : {}) }}
          onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(43,79,216,.38)"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(43,79,216,.28)"; }}
        >
          {loading ? (
            <><div style={S.spinner} /> Generating…</>
          ) : (
            <><Sparkles size={15} /> {list ? "Regenerate" : "Generate with AI"}</>
          )}
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={S.loading}>
          <div style={S.spinner} />
          Crafting your perfect packing list for {trip.destination?.city}…
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !list && (
        <div style={S.empty}>
          <div style={S.emptyIcon}>
            <Package size={30} color="#4F46E5" strokeWidth={1.5} />
          </div>
          <p style={S.emptyTitle}>No packing list yet</p>
          <p style={S.emptySub}>
            Hit "Generate with AI" — we'll tailor it to your{" "}
            {trip.destination?.city} trip, season, and planned activities.
          </p>
        </div>
      )}

      {/* ── Generated list ── */}
      {!loading && list && (
        <>
          {/* Stats */}
          <div style={S.statsRow}>
            {[
              { val: `${packedCount}/${totalItems}`, lbl: "Items packed" },
              { val: `${pct}%`,                      lbl: "Complete"     },
              { val: essentials,                     lbl: "Essentials"   },
              { val: list.categories?.length,        lbl: "Categories"   },
            ].map(({ val, lbl }) => (
              <div key={lbl} style={S.stat}>
                <div style={S.statVal}>{val}</div>
                <div style={S.statLbl}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={S.actionsRow}>
            <button style={S.actionBtn} onClick={() => setChecked({})}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor="#2B4FD8"; e.currentTarget.style.color="#2B4FD8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#374151"; }}>
              <RotateCcw size={13} /> Uncheck all
            </button>
            <button style={S.actionBtn} onClick={exportTxt}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor="#2B4FD8"; e.currentTarget.style.color="#2B4FD8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#374151"; }}>
              <Download size={13} /> Export .txt
            </button>
          </div>

          {/* Tips */}
          {list.tips?.length > 0 && (
            <div style={S.tips}>
              <p style={S.tipsTitle}>💡 Tips for {trip.destination?.city}</p>
              {list.tips.map((tip, i) => (
                <p key={i} style={{ ...S.tip, marginBottom: i < list.tips.length - 1 ? 6 : 0 }}>
                  <span style={{ marginTop: 2 }}>→</span> {tip}
                </p>
              ))}
            </div>
          )}

          {/* Category cards grid */}
          <div style={S.grid}>
            {list.categories?.map((cat, ci) => {
              const catPacked = cat.items.filter((_, ii) => checked[`${ci}-${ii}`]).length;
              const catPct    = cat.items.length ? (catPacked / cat.items.length) * 100 : 0;
              const isOpen    = !collapsed[ci];

              return (
                <div key={ci} className="pl-cat" style={S.cat}>
                  {/* header */}
                  <div style={S.catHeader} onClick={() => toggleCat(ci)}>
                    <div style={S.catLeft}>
                      <div style={S.catEmoji}>{cat.emoji}</div>
                      <div>
                        <div style={S.catName}>{cat.name}</div>
                        <div style={S.catCount}>{catPacked}/{cat.items.length} packed</div>
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronUp size={16} color="#9CA3AF" />
                      : <ChevronDown size={16} color="#9CA3AF" />}
                  </div>

                  {/* progress bar */}
                  <div style={S.progress}>
                    <div style={{ ...S.progFill, width: `${catPct}%` }} />
                  </div>

                  {/* items */}
                  {isOpen && (
                    <div style={S.items}>
                      {cat.items.map((item, ii) => {
                        const key  = `${ci}-${ii}`;
                        const done = !!checked[key];
                        return (
                          <div
                            key={ii}
                            className="pl-item"
                            style={{ ...S.item, borderBottom: ii < cat.items.length - 1 ? "1px solid #F9FAFB" : "none" }}
                            onClick={() => toggleItem(ci, ii)}
                          >
                            <div style={{ ...S.checkbox, ...(done ? S.checkboxOn : {}) }}>
                              {done && <CheckSVG />}
                            </div>
                            <span style={{ ...S.itemName, ...(done ? S.itemDone : {}) }}>
                              {item.name}
                            </span>
                            {item.essential && !done && (
                              <span style={S.essential}>essential</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* All done banner */}
          {pct === 100 && (
            <div style={{ marginTop: 24, background: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", border: "1px solid #6EE7B7", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <CheckCircle2 size={22} color="#059669" />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "#065F46", fontSize: 15 }}>You're all packed! ✈️</p>
                <p style={{ margin: 0, color: "#047857", fontSize: 13 }}>Nothing left to pack — enjoy your trip to {trip.destination?.city}!</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}