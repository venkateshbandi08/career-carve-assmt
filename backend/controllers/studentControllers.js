import studentModel from "../models/studentModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mentorModel from "../models/mentorModel.js";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

// check mentor availability
const mentorAvailability = async (mentorId, date, from, to) => {
  try {
    const currMentor = await mentorModel.findById(mentorId);

    if (!currMentor) {
      return false;
    }
    const requestedStartTime = moment(`${date} ${from}`, "DD-MM-YYYY hh:mm A");
    const requestedEndTime = moment(`${date} ${to}`, "DD-MM-YYYY hh:mm A");

    const isMentorAvailable = currMentor.mySchedules.every((booking) => {
      const bookingStartTime = moment(
        `${booking.date} ${booking.from}`,
        "DD-MM-YYYY hh:mm A"
      );
      const bookingEndTime = moment(
        `${booking.date} ${booking.to}`,
        "DD-MM-YYYY hh:mm A"
      );

      return (
        requestedEndTime.isBefore(bookingStartTime) ||
        requestedStartTime.isAfter(bookingEndTime)
      );
    });

    if (isMentorAvailable) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while checking mentor's availability",
      error,
    });
  }
};

// crreating user token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// login user
const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    // checking is student exists or not
    const student = await studentModel.findOne({ email });
    if (!student) {
      return res.json({
        success: false,
        message: "User Doesn't exists! Register now",
      });
    }
    // checking password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = createToken(student._id);
    return res.json({
      success: true,
      studentToken: token,
      studentName: student.name,
      studentId: student._id,
    });
  } catch (error) {
    console.log(error);
  }
};

// Register user
const registerStudent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // checking student already exists or not
    const exists = await studentModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists!" });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new studentModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const student = await newStudent.save();
    const token = createToken(student._id);
    return res.json({
      success: true,
      studentToken: token,
      studentName: student.name,
      studentId: student._id,
      message: "Student registered and Logged in successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// booking mentor
const bookMentor = async (req, res) => {
  const {
    mentorId,
    mentorName,
    studentName,
    from,
    date,
    to,
    duration,
    areaOfInterest,
  } = req.body;
  try {
    const isMentorAvailable = await mentorAvailability(
      mentorId,
      date,
      from,
      to
    );
    console.log(isMentorAvailable);
    if (isMentorAvailable.success) {
      // res.json(isMentorAvailable);
      const currStudent = await studentModel.findById(req.body.studentId);
      const newBooking = {
        bookingId: uuidv4(),
        mentorId,
        mentorName,
        studentName,
        date,
        from,
        to,
        duration,
        areaOfInterest,
      };
      currStudent.myBookings.push(newBooking);
      await currStudent.save();

      const currMentor = await mentorModel.findById(mentorId);
      currMentor.mySchedules.push(newBooking);
      await currMentor.save();

      return res.json({
        success: true,
        message: "Booking Successfull",
        durationMessage: "Mentor is available during the requested time",
      });
    } else {
      return res.json({
        success: false,
        message: "Booking UnSuccessfull",
        durationMessage: "Mentor is busy during the requested time",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// get all mentors
const allMentors = async (req, res) => {
  try {
    const allMentors = await mentorModel.find();
    return res.json({ success: true, allMentors });
  } catch (error) {
    console.log(error);
  }
};

// my bookings
const myBookings = async (req, res) => {
  try {
    const studentProfile = await studentModel.findById(req.body.studentId);
    const myAllBookings = studentProfile.myBookings;
    return res.json({ success: true, myBookings: myAllBookings });
  } catch (error) {
    console.log(error);
  }
};

// delete booking
const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const currStudent = await studentModel.findById(req.body.studentId);
    // console.log(currStudent)
    // console.log(req.body.id)
    // console.log(bookingId)
    if (!currStudent) {
      return res.json({
        success: false,
        message: "Student not found to delete booking",
      });
    }

    const currBooking = currStudent.myBookings.find(
      (booking) => booking.bookingId === bookingId
    );

    if (!currBooking) {
      return res.json({
        success: false,
        message: "Booking not found to delete",
      });
    }

    const currMentorId = currBooking.mentorId;

    await studentModel.findByIdAndUpdate(
      req.body.studentId,
      { $pull: { myBookings: { bookingId: bookingId } } },
      { new: true }
    );

    // console.log(currMentorId)

    const currMentor = await mentorModel.findByIdAndUpdate(
      currMentorId,
      { $pull: { mySchedules: { bookingId: bookingId } } },
      { new: true }
    );

    if (currMentor) {
      res.json({ success: true, message: "Booking deleted successfully" });
    } else {
      res.json({
        success: false,
        message: "Mentor not found to delete the booking",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "An error occurred in deleting student's booking",
      error,
    });
  }
};

export {
  loginStudent,
  registerStudent,
  bookMentor,
  allMentors,
  myBookings,
  deleteBooking,
};

// {
//   success: true,
//   message: "Mentor is available during the requested time",
// };

// {
//   success: false,
//   message: "Mentor is busy during the requested time",
// };
