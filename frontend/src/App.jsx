import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InitialPage from "./pages/initialPage/InitialPage";
import StudentLogin from "./pages/studentPages/studentLoginPage/StudentLogin";
import MentorLogin from "./pages/mentorPages/mentorLoginPage/MentorLogin";
import StudentHomePage from "./pages/studentPages/studentHomePage/StudentHomePage";
import StudentRegisterPage from "./pages/studentPages/studentRegisterPage/StudentRegisterPage";
import MentorBooking from "./pages/studentPages/mentorBookingPage/MentorBooking";
import MyBookingsPage from "./pages/studentPages/myBookingsPage/MyBookingsPage";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegisterPage />} />
        <Route path="/mentor-login" element={<MentorLogin />} />
        <Route path="/student-homepage" element={<StudentHomePage />} />
        <Route path="/mentor-booking" element={<MentorBooking />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Routes>
    </div>
  );
};

export default App;
