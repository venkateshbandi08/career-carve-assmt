import express from "express";
import {
  loginMentor,
  registerMentor,
  mentorSchedules
} from "../controllers/mentorControllers.js";

const mentorRouter = express.Router();

mentorRouter.post("/register", registerMentor);
mentorRouter.post("/login", loginMentor);
mentorRouter.get("/my-schedules", mentorSchedules);

export default mentorRouter;
