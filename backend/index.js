import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import studentRouter from "./routes/studentRoutes.js";
import mentorRouter from "./routes/mentorRoutes.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// api end points
app.use("/api/student", studentRouter);
app.use("/api/mentor", mentorRouter);

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
