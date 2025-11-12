import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDataBase } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// dotenv config
dotenv.config();

// app config
const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());

// ✅ Secure and flexible CORS setup
app.use(
  cors({
    origin: [
      "https://food-delapp-frontend.onrender.com", // ✅ Correct frontend URL
      "https://food-delapp-admin.onrender.com"     // optional: if you have admin
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// Database connection
connectToDataBase(`${process.env.MONGODB_URL}/food-del`);

// API routes
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Food Delivery Backend is live and running!");
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server started on http://localhost:${PORT}`)
);

