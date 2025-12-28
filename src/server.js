import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import playerRoutes from "./routes/playerRoutes.js";
import sponsorRoutes from "./routes/sponsorRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"; //
import paymentRoutes from "./routes/paymentRoutes.js"
import razorpayRoutes from "./routes/razorpayRoutes.js"
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";


dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://acplsports.in",
  "https://www.acplsports.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 👇 VERY IMPORTANT
app.options("*", cors());


app.use(express.json());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api", routes);
app.use("/api/players", playerRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/contact", contactRoutes); 
app.use("/api/payment", paymentRoutes)
app.use("/api/razorpay", razorpayRoutes)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
