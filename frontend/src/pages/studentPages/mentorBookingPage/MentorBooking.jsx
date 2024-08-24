import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./MentorBooking.css";
import StudentHeader from "../../../components/studentHeader/StudentHeader";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";

const MentorBooking = () => {
  const navigate = useNavigate();
  const [activeDuration, setActiveDuration] = useState(0);
  const location = useLocation();
  const [durationMessage, setDurationMessage] = useState("");
  const { mentor } = location.state;
  //   console.log(mentor);
  const [bookingDetails, setBookingDetails] = useState({
    mentorId: mentor?._id,
    mentorName: mentor?.name,
    studentName: localStorage.getItem("studentName"),
    date: "",
    from: "",
    to: "",
    duration: "",
    areaOfInterest: "",
  });
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const onChangeInput = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "date") {
      const formattedDate = formatDate(value);
      setBookingDetails({
        ...bookingDetails,
        [name]: formattedDate,
      });
    } else if (name === "from" || name === "to") {
      const [hour, minute] = value.split(":");
      let period = "AM";
      let hour12 = parseInt(hour, 10);

      if (hour12 >= 12) {
        period = "PM";
        if (hour12 > 12) hour12 -= 12;
      } else if (hour12 === 0) {
        hour12 = 12;
      }

      formattedValue = `${hour12}:${minute} ${period}`;

      setBookingDetails({
        ...bookingDetails,
        [name]: formattedValue,
      });
    } else {
      setBookingDetails({
        ...bookingDetails,
        [name]: value,
      });
    }
  };

  const bookMentor = async () => {
    const url = `${import.meta.env.VITE_BASE_URL}/api/student/book-mentor`;
    const response = await axios.post(url, bookingDetails, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
      },
    });
    console.log(response);
    if (response.data.success) {
      toast.success(response.data.message);
      setDurationMessage(response.data.durationMessage);
      navigate("/my-bookings");
    } else {
      setDurationMessage(response.data.durationMessage);
    }
  };

  const onSubmitLoginForm = (e) => {
    e.preventDefault();
    // console.log(bookingDetails);
    bookMentor();
  };
  const onClickDuration = (id) => {
    if (id === 0) {
      setBookingDetails({
        ...bookingDetails,
        duration: "30 mins",
      });
    } else if (id === 1) {
      setBookingDetails({
        ...bookingDetails,
        duration: "45 mins",
      });
    } else if (id === 2) {
      setBookingDetails({
        ...bookingDetails,
        duration: "60 mins",
      });
    }
    setActiveDuration(id);
  };

  //   useEffect(() => {
  //     bookMentor();
  //   }, [bookingDetails.to])

  //   const checkMentorAvailability = async () => {
  //     const url = `${
  //       import.meta.env.VITE_BASE_URL
  //     }/api/student/mentor-availability`;
  //     const response = await axios.post(
  //       url,
  //       {
  //         from: bookingDetails.from,
  //         to: bookingDetails.to,
  //         date: bookingDetails.date,
  //         mentorId: bookingDetails.mentorId,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
  //         },
  //       }
  //     );
  //     if (response.data.success) {
  //       setDurationMessage({
  //         status: true,
  //         message: response.data.message,
  //       });
  //     } else {
  //       setDurationMessage({
  //         status: false,
  //         message: response.data.message,
  //       });
  //     }
  //     console.log(response);
  //   };

  //   // checking availability
  //   useEffect(() => {
  //     if (bookingDetails.date && bookingDetails.from && bookingDetails.to) {
  //       checkMentorAvailability();
  //     }
  //   }, [bookingDetails]);

  return (
    <div className="mentor-booking-page-container">
      <StudentHeader />
      <h4 style={{ textAlign: "center" }}>Mentor Details</h4>
      <div className="mb-mentor-card-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingRight: "5rem",
          }}
        >
          <img
            src="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            alt="Mentor"
            className="mb-mentor-image"
          />
          <h4>{mentor?.name}</h4>
          {mentor.isPremium ? <p>Premium: star</p> : ""}
        </div>
        <div className="mb-mentor-content-container">
          <p>Designation: {mentor?.designation}</p>
          <p>Experience: {mentor?.experience}+ yrs</p>
          <p>Expertise: </p>
          {mentor.areaOfInterests.map((eachItem, index) => (
            <p className="mb-expertise-name">{eachItem}</p>
          ))}

          <p>Rating: {mentor?.rating}</p>
          <p>
            Availability: From {mentor?.availabilityTime.from} to{" "}
            {mentor?.availabilityTime.to}
          </p>
        </div>
      </div>
      <h4 style={{ textAlign: "center" }}>Mentor Booking Form</h4>
      <div className="mb-booking-form-container">
        <Form className="mb-booking-form" onSubmit={onSubmitLoginForm}>
          <Form.Group className="mb-3" controlId="formBasicToTime">
            <Form.Label>Area of Interest :</Form.Label>
            <Form.Control
              type="teext"
              placeholder="Enter your interested area"
              name="areaOfInterest"
              onChange={(e) => onChangeInput(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicToTime">
            <Form.Label>Duration</Form.Label>
            <div className="mb-durations-container">
              <h5
                onClick={() => onClickDuration(0)}
                className={
                  activeDuration === 0
                    ? "btn btn-success"
                    : "btn btn-outline-success"
                }
                value={bookingDetails.duration}
              >
                30 mins
              </h5>
              <h5
                onClick={() => onClickDuration(1)}
                className={
                  activeDuration === 1
                    ? "btn btn-success"
                    : "btn btn-outline-success"
                }
                value={bookingDetails.duration}
              >
                45 mins
              </h5>
              <h5
                onClick={() => onClickDuration(2)}
                className={
                  activeDuration === 2
                    ? "btn btn-success"
                    : "btn btn-outline-success"
                }
                value={bookingDetails.duration}
              >
                60 mins
              </h5>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date : </Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter date"
              name="date"
              onChange={(e) => onChangeInput(e)}
              //   value={bookingDetails.date}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicFromTime">
            <Form.Label>From Time :</Form.Label>
            <Form.Control
              type="time"
              placeholder="Enter from time"
              name="from"
              onChange={(e) => onChangeInput(e)}
              //   value={bookingDetails.from}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicToTime">
            <Form.Label>To Time :</Form.Label>
            <Form.Control
              type="time"
              placeholder="Enter To time"
              name="to"
              onChange={(e) => onChangeInput(e)}
              //   value={bookingDetails.to}
            />
          </Form.Group>

          <p className="">{durationMessage}</p>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default MentorBooking;
