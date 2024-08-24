import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (token) {
      navigate("/student-homepage", { replace: true });
    }
  }, [navigate]);

  const onChangeInput = (e) => {
    setStudentDetails({
      ...studentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitLoginForm = (event) => {
    event.preventDefault();
    if (!studentDetails.email) {
      toast.error("E-mail field can't be empty");
      return;
    } else if (!studentDetails.password) {
      toast.error("Password field can't be empty");
      return;
    }
    const fetchStudentLogin = async () => {
      const loginUrl = `${import.meta.env.VITE_BASE_URL}/api/student/login`;
      try {
        const response = await axios.post(loginUrl, studentDetails);
        if (response.data.success) {
          localStorage.setItem("studentToken", response.data.studentToken);
          localStorage.setItem("studentName", response.data.studentName);
          toast.success("Student Login Successful");
          navigate("/student-homepage", { replace: true });
        } else {
          toast.error("Error occurred in student login");
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
      }
    };
    fetchStudentLogin();
  };

  return (
    <div>
      <Form onSubmit={onSubmitLoginForm}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={(e) => onChangeInput(e)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => onChangeInput(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <p>
        Don't have an Account?{" "}
        <Link to="/student-register">
          <span> Register here </span>
        </Link>
      </p>
    </div>
  );
};

export default StudentLogin;
