import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { IoBagOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function StudentHeader() {
  const navigate = useNavigate();

  const onClickLogoutBtn = () => {
    localStorage.removeItem("studentToken");
    navigate("/", { replace: true });
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <h3>React-Bootstrap</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="#deets">
              <IoBagOutline />
            </Nav.Link>
            <Nav.Item>
              <button onClick={onClickLogoutBtn} className="btn btn-link">
                Logout
              </button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default StudentHeader;
