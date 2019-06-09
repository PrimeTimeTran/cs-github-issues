import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Navbar,
  Container,
  InputGroup,
  FormControl
} from 'react-bootstrap'

export default class AuthenticationScreen extends Component {
  render() {
    return (
      <Container style={{ backgroundColor: 'lightblue', height: '100vh' }}>
        <Row>
          <Col><h1>Authentication Screen!</h1></Col>
          <Col>2 of 2</Col>
        </Row>
        <Row>
          <Col>1 of 3</Col>
          <Col>2 of 3</Col>
          <Col>3 of 3</Col>
        </Row>
      </Container>
    )
  }
}

