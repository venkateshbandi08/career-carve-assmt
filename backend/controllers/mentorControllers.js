import mentorModel from "../models/mentorModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// creating user token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// login mentor
const loginMentor = async (req, res) => {
  const { email, password } = req.body;
  try {
    // checking is mentor exists or not
    const mentor = await mentorModel.findOne({ email });
    if (!mentor) {
      return res.json({
        success: false,
        message: "Email Doesn't exists! Register now",
      });
    }
    // checking password
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = createToken(mentor._id);
    return res.json({
      success: true,
      mentorToken: token,
      mentorName: mentor.name,
      mentorId: mentor._id,
    });
  } catch (error) {
    console.log(error);
  }
};

// Register Mentor
const registerMentor = async (req, res) => {
  let {
    name,
    email,
    password,
    rating,
    experience,
    designation,
    isPremium,
    from,
    to,
    areaOfInterests,
  } = req.body;
  try {
    // checking mentor already exists or not
    if (isPremium) {
      isPremium = true;
    } else {
      isPremium = false;
    }
    const exists = await mentorModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists!" });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // new mentor
    const newMentor = new mentorModel({
      name: name,
      email: email,
      experience,
      designation,
      rating,
      password: hashedPassword,
      availabilityTime: { from: from, to: to },
      areaOfInterests: areaOfInterests,
    });

    const mentor = await newMentor.save();
    const token = createToken(mentor._id);
    return res.json({
      success: true,
      mentorToken: token,
      mentorName: mentor.name,
      mentorId: mentor._id,
    });
  } catch (error) {
    console.log(error);
  }
};

// get my schedules
const mentorSchedules = async (req, res) => {
  const { mentorId } = req.body;
  try {
    const currMentor = await mentorModel.findById(mentorId);
    if (!currMentor) {
      return res.json({ success: false, message: "No mentor found" });
    }
    const schedules = currMentor.mySchedules;
    return res.json({ success: true, mentorSchedules: schedules });
  } catch (error) {
    console.log(error);
  }
};

export { loginMentor, registerMentor, mentorSchedules };
