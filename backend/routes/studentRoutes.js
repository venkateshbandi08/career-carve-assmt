import express from "express";
import {
  registerStudent,
  loginStudent,
  bookMentor,
  allMentors,
  myBookings,
  deleteBooking,
} from "../controllers/studentControllers.js";
import authMiddleWare from "../middlewares/auth.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.post("/login", loginStudent);
studentRouter.post("/book-mentor", authMiddleWare, bookMentor);
studentRouter.get("/all-mentors", authMiddleWare, allMentors);
studentRouter.get("/my-bookings", authMiddleWare, myBookings);
studentRouter.delete(
  "/delete-booking/:bookingId",
  authMiddleWare,
  deleteBooking
);

export default studentRouter;
