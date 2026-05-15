// server/utils/climateScorer.js

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

function scoreMonth(monthData) {
  let score = 100;

  // Penalise heavy rainfall
  if (monthData.rainfallMM > 300) score -= 40;
  else if (monthData.rainfallMM > 150) score -= 25;
  else if (monthData.rainfallMM > 80) score -= 15;
  else if (monthData.rainfallMM > 40) score -= 5;

  // Penalise extreme cold
  if (monthData.avgTempMin < -5) score -= 20;
  else if (monthData.avgTempMin < 0) score -= 10;

  // Penalise extreme heat
  if (monthData.avgTempMax > 40) score -= 20;
  else if (monthData.avgTempMax > 37) score -= 10;

  // Penalise very high crowd
  if (monthData.crowdScore >= 9) score -= 10;
  else if (monthData.crowdScore >= 7) score -= 5;

  // Bonus for ideal temperature
  if (monthData.avgTempMax >= 18 && monthData.avgTempMax <= 30) score += 10;

  return Math.max(0, Math.min(100, score));
}

function getWarnings(monthData) {
  const warnings = [];
  if (monthData.rainfallMM > 300) warnings.push("Very heavy rainfall expected");
  if (monthData.rainfallMM > 150) warnings.push("Heavy monsoon rains likely");
  if (monthData.avgTempMin < -5)
    warnings.push("Sub-zero temperatures — carry warm gear");
  if (monthData.avgTempMax > 40) warnings.push("Extreme heat — stay hydrated");
  if (monthData.crowdScore >= 9)
    warnings.push("Peak season — book well in advance");
  return warnings;
}

export { scoreMonth, getWarnings, MONTH_NAMES };
