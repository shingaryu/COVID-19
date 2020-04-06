import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { GraphComponent } from './graphComponent'

function App() {
  return (
  <div>
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">COVID-19 ItalFit</Navbar.Brand>
    </Navbar>
    <GraphComponent></GraphComponent>
  </div>
  );
}

export default App;
