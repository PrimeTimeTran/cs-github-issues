import React, { Component } from "react";

import { Row, Card, ListGroup, Button } from "react-bootstrap";

import moment from "moment";
import EmbeddedGist from "./EmbeddedGist.js";

import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";

import {
  FaStar,
  FaBook,
  FaHome,
  FaUsers,
  FaHeart,
  FaGithub,
  FaBookOpen,
  FaSignOutAlt,
  FaCodeBranch,
  FaExclamationCircle
} from "react-icons/fa";

export default class HomeScreen extends Component {
  componentDidMount() {
    let go = [];
    if (this.props.gists.length > 0) {
      this.props.gists(gist => {
        console.log("componentDidMount");
        go.push(gist.content);
      });
      console.log("g", go);
    }
  }
  onSidebarClick = selected => {
    if (selected.substring(0, 4) === "repo") {
      this.props.onSelectRepo(selected.substring(4, selected.length));
    }
    if (selected === "Log Out") {
      this.props.onLogOut();
    }
    if (selected === "gists") {
      this.props.onShowGists();
    }
    if (selected === "home") {
      this.props.onShowHome();
    }
  };

  renderRepos = () => {
    return this.props.currentUserRepos.map(repo => {
      return (
        <NavItem eventKey={"repo" + repo.name}>
          <NavText onClick={() => console.log("sdjshjs")}>{repo.name}</NavText>
        </NavItem>
      );
    });
  };

  renderSearchedRepos() {
    return (
      this.props.renderRepos &&
      this.props.searchedRepos.map((repo, idx) => {
        return (
          <Card key={idx} style={{ width: "60vw", margin: 15, padding: 35 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Card.Img
                variant="top"
                src={repo.owner.avatar_url}
                style={{ width: "20%", height: "30%" }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {moment(repo.created_at).fromNow()}
                <Button style={{ height: 50 }}>
                  <FaStar /> Star
                </Button>
              </div>
            </div>
            <Card.Body>
              <Card.Title
                onClick={() => window.open(repo.html_url)}
                style={{ color: "#007bff", fontSize: 40 }}
              >
                {repo.name}
              </Card.Title>
              <Card.Text>{repo.description}</Card.Text>
              <Card.Link href={repo.html_url}>
                <FaGithub style={{ marginRight: 5 }} />
                GitHub
              </Card.Link>
              <Card.Link href={repo.homepage}>
                <FaBook style={{ marginRight: 5 }} />
                Homepage
              </Card.Link>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item
                action
                href={`https://github.com/${repo.owner.login}/${repo.name}/issues`}
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <FaExclamationCircle style={{ marginRight: 5 }} />
                Issues: {repo.open_issues}
              </ListGroup.Item>

              <ListGroup.Item style={{ display: "flex", alignItems: "center" }}>
                <FaStar style={{ marginRight: 5 }} />
                Stars: {repo.stargazers_count}
              </ListGroup.Item>
              <ListGroup.Item style={{ display: "flex", alignItems: "center" }}>
                <FaUsers style={{ marginRight: 5 }} />
                Watchers: {repo.watchers_count}
              </ListGroup.Item>
              <ListGroup.Item style={{ display: "flex", alignItems: "center" }}>
                <FaCodeBranch style={{ marginRight: 5 }} />
                Forks: {repo.forks}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        );
      })
    );
  }

  getFirstFile = gist => {
    return Object.keys(gist.files)[0];
  };

  renderGists() {
    return this.props.gists.map(gist => {
      return (
        <div key={gist.id} style={{ width: "80%" }}>
          <h4>
            {gist.owner.login}/{Object.keys(gist.files)[0]}
          </h4>
          <EmbeddedGist
            gist={gist.owner.login + "/" + gist.id}
            file={Object.keys(gist.files)[0]}
          />
          <hr />
        </div>
      );
    });
  }

  render() {
    return (
      <div className="main">
        <SideNav className="nav-style" onSelect={this.onSidebarClick}>
          <SideNav.Toggle />
          <SideNav.Nav defaultSelected="home">
            <NavItem eventKey="home">
              <NavIcon>
                <FaHome />
              </NavIcon>
              <NavText>Home</NavText>
            </NavItem>
            <NavItem eventKey="myrepos">
              <NavIcon>
                <FaGithub />
              </NavIcon>
              <NavText>
                Your Repos ({this.props.currentUserRepos.length})
              </NavText>
              {this.renderRepos()}
            </NavItem>
            <NavItem eventKey="gists">
              <NavIcon>
                <FaBookOpen />
              </NavIcon>
              <NavText>Gists</NavText>
            </NavItem>
            <NavItem eventKey="favorites">
              <NavIcon>
                <FaHeart />
              </NavIcon>
              <NavText>Favorites</NavText>
              <NavItem eventKey={"repo"}>
                <NavText>Hittiti</NavText>
              </NavItem>
              <NavItem eventKey={"repo"}>
                <NavText>Hittiti</NavText>
              </NavItem>
              <NavItem eventKey={"repo"}>
                <NavText>Hittiti</NavText>
              </NavItem>
              <NavItem eventKey={"repo"}>
                <NavText>Hittiti</NavText>
              </NavItem>
            </NavItem>
            <NavItem eventKey="Log Out" navitemStyle={{ alignSelf: 'flex-end' }}>
              <NavIcon>
                <FaSignOutAlt />
              </NavIcon>
              <NavText>Log Out</NavText>
            </NavItem>
          </SideNav.Nav>
        </SideNav>
        <Row
          style={{
            marginLeft: 300,
            overflowY: "scroll",
            height: "100vh",
            backgroundColor: "red"
          }}
        >
          <div className="container">
            {this.props.renderRepos && this.renderSearchedRepos()}
            {this.props.renderGists && this.renderGists()}
          </div>
        </Row>
      </div>
    );
  }
}
