import React from "react";
import { Form, Button, Navbar, InputGroup, FormControl } from "react-bootstrap";

export default function Navbarr(props) {
  return (
    <Navbar
      className="justify-content-between"
      style={{ backgroundColor: "#080705", paddingLeft: 55 }}
    >
      <Form inline>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Username"
            aria-describedby="basic-addon1"
            placeholder={
              (props.currentUser && props.currentUser.login) || "Username"
            }
          />
        </InputGroup>
      </Form>
      <Form inline onSubmit={e => props.onRepoSearch(e)}>
        <FormControl
          type="text"
          placeholder="Search"
          className=" mr-sm-2"
          onChange={props.onSearching}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </Navbar>
  );
}
