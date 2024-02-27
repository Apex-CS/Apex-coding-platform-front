import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function navDark() {
  return (
    <>
      <Navbar fixed="top" bg="dark" data-bs-theme="dark">
      <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/img/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            APEX Code Platform
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#pricing">Name of Candidate for level</Nav.Link>
          </Nav>
        </Container>
        <Container>
        </Container>
      </Navbar>
    </>
  );
}

export default navDark;