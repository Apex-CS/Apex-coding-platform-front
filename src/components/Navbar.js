import React, { useState, useRef, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


function NavDark() {
  const Ref = useRef(null);
  const [timer, setTimer] = useState("00:00:00");

  const getTimeRemaining = (e) => {
      const total = Date.parse(e) - Date.parse(new Date());
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor(
          (total / 1000 / 60) % 60
      );
      const hours = Math.floor(
          (total / 1000 / 60 / 60) % 24
      );
      return {
          total,
          hours,
          minutes,
          seconds,
      };
  };

  const startTimer = (e) => {
      let { total, hours, minutes, seconds } =
          getTimeRemaining(e);
      if (total >= 0) {
          setTimer(
              (hours > 9 ? hours : "0" + hours) +
              ":" +
              (minutes > 9
                  ? minutes
                  : "0" + minutes) +
              ":" +
              (seconds > 9 ? seconds : "0" + seconds)
          );
      }
  };

  const clearTimer = (e) => {
      setTimer("00:30:00");
      if (Ref.current) clearInterval(Ref.current);
      const id = setInterval(() => {
          startTimer(e);
      }, 1000);
      Ref.current = id;
  };

  const getDeadTime = () => {
      let deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 1800);
      return deadline;
  };
  useEffect(() => {
      clearTimer(getDeadTime());
  }, []);

  const onClickReset = () => {
      clearTimer(getDeadTime());
  };
  
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
        </Container>
        <Nav className="container-fluid">
          <Nav.Item className="ml-auto">
            <Nav.Link ><h5>Interviewer</h5></Nav.Link>
          </Nav.Item>
          <Nav.Item className="ml-auto">
            <Nav.Link ><h5>Name of Candidate for level</h5></Nav.Link>
          </Nav.Item>
          <Nav.Item className="ml-auto">
            <Nav.Link ><h4>{timer}</h4> </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </>
  );
}
//<Nav.Link ><h4>{timer} <button className="run-btn" onClick={onClickReset}>Start</button></h4></Nav.Link>
export default NavDark;