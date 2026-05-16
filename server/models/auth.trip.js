import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: String,
  type: String, 
  lat: Number,
  lng: Number,
  time: String,
});

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  activities: [activitySchema],
});

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    destination: {
      city: String,
      country: String,
    },
    startDate: Date,
    endDate: Date,

    days: [daySchema], // itinerary

    budget: {
      total: Number,
      expenses: [
        {
          name: String,
          amount: Number,
        },
      ],
    },
    notes: String,
    isSaved: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true, // null for private trips, unique token for shared ones
    },
  },
  { timestamps: true }
);


export default mongoose.model("Trip", tripSchema);