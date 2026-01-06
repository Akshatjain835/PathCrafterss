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

    dates: {
      startDate: Date,
      endDate: Date,
    },

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
  },
  { timestamps: true }
);


export default mongoose.model("Trip", tripSchema);
