import React, { useEffect, useState } from "react";
import StudentHeader from "../../../components/studentHeader/StudentHeader";
import "./StudentHomePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();

  const fetchMentors = async () => {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/api/student/all-mentors`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
        },
      });
      if (response.data.success) {
        setMentors(response.data.allMentors);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const onClickBookNowbutton = (mentor) => {
    navigate("/mentor-booking", { state: { mentor } });
  };

  return (
    <div className="student-home-container">
      <StudentHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          border: "1px solid black",
          height: "100%",
        }}
      >
        <div className="student-home-container-content-container">
          <div>
            Hi Venkatesh, book your mentor now in your interested domain!
          </div>
          <div>search bar container</div>
          <div className="mentors-list-container" style={{ display: "flex" }}>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              mentors.map((eachMentor) => (
                <div className="mentor-card-container" key={eachMentor._id}>
                  <div style={{ marginRight: "0.5rem" }}>
                    <img
                      src="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                      alt="Mentor"
                      className="mentor-image"
                    />
                    <h4>{eachMentor?.name}</h4>
                    {eachMentor.isPremium ? <p>Premium: star</p> : ""}
                  </div>
                  <div className="mentor-content-container">
                    <p>Designation: {eachMentor?.designation}</p>
                    <p>Experience: {eachMentor?.experience} yrs</p>
                    <p>Expertise: {eachMentor?.areaOfInterests}</p>
                    <p>Rating: {eachMentor?.rating}</p>
                    <button
                      onClick={() => onClickBookNowbutton(eachMentor)}
                      className="book-now-button"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;
