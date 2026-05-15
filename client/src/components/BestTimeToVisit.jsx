import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Sun,
  CloudRain,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CloudLightning,
  CalendarCheck,
  AlertTriangle,
} from "lucide-react";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function BestTimeToVisit({ destination }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) return;
    axios
      .get(`http://localhost:5001/api/climate/${destination}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [destination]);

  if (loading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading climate data...
      </div>
    );
  if (!data || !data.months) return null;

  const recommendedMonths =
    data.bestMonths?.map((mNum) => MONTH_NAMES[mNum - 1]) || [];

  const getScoreVisual = (score) => {
    if (score >= 75)
      return {
        icon: <CheckCircle2 size={22} color="#1D9E75" />,
        label: "Best",
        bg: "#f0fff7",
        borderColor: "#c6f6d5",
      };
    if (score >= 55)
      return {
        icon: <AlertCircle size={22} color="#BA7517" />,
        label: "Medium",
        bg: "#fffaf0",
        borderColor: "#fdf2f2",
      };
    return {
      icon: <XCircle size={22} color="#D85A30" />,
      label: "Avoid",
      bg: "#fff5f5",
      borderColor: "#fed7d7",
    };
  };

  const CrowdIcons = ({ level }) => {
    const levels = { low: 1, moderate: 2, high: 3, very_high: 4 };
    const count = levels[level] || 1;
    const color =
      level === "low"
        ? "#1D9E75"
        : level === "moderate"
        ? "#BA7517"
        : "#D85A30";
    return (
      <div style={{ display: "flex", gap: "1px" }}>
        {[...Array(4)].map((_, i) => (
          <Users key={i} size={12} color={i < count ? color : "#ddd"} />
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "500px",
        margin: "10px auto",
        color: "#333",
      }}
    >
      {/* 🌟 RECOMMENDED MONTHS SUMMARY */}
      {recommendedMonths.length > 0 && (
        <div
          style={{
            backgroundColor: "#f0fff7",
            padding: "16px",
            borderRadius: "16px",
            marginBottom: "20px",
            border: "1px solid #c6f6d5",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <CalendarCheck size={20} color="#1D9E75" />
            <span
              style={{ fontSize: "13px", fontWeight: 700, color: "#276749" }}
            >
              BEST MONTHS TO GO
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {recommendedMonths.map((name, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: "#1D9E75",
                  color: "white",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.months.map((month, i) => {
          const status = getScoreVisual(month.score);
          const isRainy = month.rainfallMM > 100;
          const isABestMonth = data.bestMonths?.includes(month.month);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "12px",
                borderRadius: "15px",
                background: status.bg,
                border: isABestMonth ? "2px solid #1D9E75" : "1px solid #eee",
                gap: "8px",
              }}
            >
              {/* TOP ROW: DATA POINTS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.2fr 1fr 1fr 0.6fr",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {status.icon}
                  <span style={{ fontWeight: 800, fontSize: "15px" }}>
                    {MONTH_NAMES[month.month - 1]}
                  </span>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#e11d48",
                      }}
                    >
                      {month.avgTempMax}°
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#2563eb",
                      }}
                    >
                      {month.avgTempMin}°
                    </span>
                  </div>
                  <div
                    style={{
                      width: "4px",
                      height: "20px",
                      background: "linear-gradient(#e11d48, #2563eb)",
                      borderRadius: "2px",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {isRainy ? (
                    <CloudLightning size={18} color="#2563eb" />
                  ) : (
                    <Sun size={18} color="#f59e0b" />
                  )}
                  <span style={{ fontSize: "10px" }}>
                    {isRainy ? "Rain" : "Sunny"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <CrowdIcons level={month.crowdLevel} />
                  <span style={{ fontSize: "9px", fontWeight: 600 }}>
                    {month.crowdLevel.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    fontWeight: 900,
                    fontSize: "14px",
                    opacity: 0.8,
                  }}
                >
                  {month.score}
                </div>
              </div>

              {/* BOTTOM ROW: THE "WHY" (Reasoning) */}
              {!isABestMonth && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 10px",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderRadius: "8px",
                    border: "1px dashed rgba(0,0,0,0.1)",
                  }}
                >
                  <AlertTriangle
                    size={14}
                    color={month.score < 55 ? "#D85A30" : "#BA7517"}
                  />
                  <span
                    style={{ fontSize: "11px", fontWeight: 600, color: "#444" }}
                  >
                    {month.warnings && month.warnings.length > 0
                      ? month.warnings[0]
                      : month.avgTempMax > 35
                      ? "Very Hot weather"
                      : isRainy
                      ? "Heavy rains expected"
                      : month.crowdLevel === "very_high"
                      ? "Extremely crowded"
                      : "Weather is not ideal"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
