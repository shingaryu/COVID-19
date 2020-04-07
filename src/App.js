import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { TimeSeriesComponent } from './timeSeriesComponent';

function App() {
  return (
  <div>
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">COVID-19 ItalFit</Navbar.Brand>
    </Navbar>
    <TimeSeriesComponent></TimeSeriesComponent>
  </div>
  );
}

export default App;
