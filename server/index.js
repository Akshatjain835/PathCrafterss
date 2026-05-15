import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";
import tripRoutes from "./routes/trip.route.js";
import aiRoutes from "./routes/ai.route.js";
import climateRouter from "./routes/climate.route.js";
import "./cron/refreshClimate.js";  

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like curl or some mobile apps)
    if (!origin) return callback(null, true);
    const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5174"];
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));




// routes
app.use("/api/auth", authRouter);
app.use("/api/trips", tripRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/climate", climateRouter);
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
