import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    myBookings: {
        type: Array,
        default: []
    }
})

const studentModel = mongoose.models.student || mongoose.model("student", studentSchema);

export default studentModel;