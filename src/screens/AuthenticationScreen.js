import React, { Component } from 'react';
import {
  Row,
  Col,
  Container,
} from 'react-bootstrap'

export default class AuthenticationScreen extends Component {
  render() {
    return (
      <Container className="d-flex justify-content-center">
        <Row>
          <Col><h1>Authentication Screen!</h1></Col>
        </Row>
      </Container>
    )
  }
}

