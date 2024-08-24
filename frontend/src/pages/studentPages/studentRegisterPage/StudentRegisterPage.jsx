import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const StudentRegisterPage = () => {
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    console.log(studentDetails);
    console.log(import.meta.env.VITE_BASE_URL);
    if (!studentDetails.name) {
      toast.error("Name field can't be empty");
      return;
    } else if (!studentDetails.email) {
      toast.error("E-mail field can't be empty");
      return;
    } else if (!studentDetails.password) {
      toast.error("Password field can't be empty");
      return;
    } else if (!studentDetails.confirmPassword) {
      toast.error("confirm Password field can't be empty");
      return;
    } else if (studentDetails.confirmPassword != studentDetails.password) {
      toast.error("password and confirm password didn't matched !");
      return;
    }
    const fetchStudentRegister = async () => {
      const registerUrl = `${
        import.meta.env.VITE_BASE_URL
      }/api/student/register`;
      const response = await axios.post(registerUrl, {
        name: studentDetails.name,
        email: studentDetails.email,
        password: studentDetails.password,
      });
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("studentToken", response.data.studentToken);
        localStorage.setItem("studentName", response.data.studentName);
        toast.success(response.data.message);
        navigate("/student-homepage", { replace: true });
      } else {
        toast.error(response.data.message);
      }
    };
    fetchStudentRegister();
  };
  return (
    <div>
      <Form onSubmit={onSubmitLoginForm}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            onChange={(e) => onChangeInput(e)}
          />
        </Form.Group>

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

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="confirmPassword"
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
        Already have an Account ?{" "}
        <Link to="/student-login">
          {" "}
          <span> Login here </span>{" "}
        </Link>{" "}
      </p>
    </div>
  );
};

export default StudentRegisterPage;
