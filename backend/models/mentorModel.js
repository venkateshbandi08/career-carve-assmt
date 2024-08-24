import mongoose from "mongoose";

const mentorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    default: "3.5",
  },
  mySchedules: {
    type: Array,
    default: [],
  },
  availabilityTime: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  areaOfInterests: {
    type: Array,
    default: [],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
});

const mentorModel =
  mongoose.models.mentor || mongoose.model("mentor", mentorSchema);

export default mentorModel;
