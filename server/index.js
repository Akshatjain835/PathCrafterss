import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";
import tripRoutes from "./routes/trip.route.js";
import aiRoutes from "./routes/ai.route.js";
import climateRouter from "./routes/climate.route.js";
import "./cron/refreshClimate.js";  
import reviewRoutes from "./routes/review.route.js";
import cityRoutes from "./routes/city.route.js";


const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like curl or some mobile apps)
    if (!origin) return callback(null, true);
    const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173", "http://localhost:5174"];
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));




// routes
app.use("/api/auth", authRouter);
app.use("/api/trips", tripRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/climate", climateRouter);
app.use("/api/city", cityRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
}).catch((error) => {
    console.error("Failed to connect to the database", error);
});
