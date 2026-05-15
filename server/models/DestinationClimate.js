import mongoose from "mongoose";

const MonthDataSchema = new mongoose.Schema({
  month:       Number,
  avgTempMin:  Number,
  avgTempMax:  Number,
  rainfallMM:  Number,
  crowdScore:  Number,   // 1-10, derived from Wikipedia pageviews
  crowdLevel:  String,   // low / moderate / high / very_high
  score:       Number,   // 0-100 final score
  warnings:    [String]
});

const DestinationClimateSchema = new mongoose.Schema({
  destination:    { type: String, required: true, unique: true },
  lat:            Number,
  lon:            Number,
  country:        String,
  months:         [MonthDataSchema],
  bestMonths:     [Number],
  cachedAt:       { type: Date, default: null },   // null = never fetched
  autoFetched:    { type: Boolean, default: true }
});

export default mongoose.model("DestinationClimate", DestinationClimateSchema);