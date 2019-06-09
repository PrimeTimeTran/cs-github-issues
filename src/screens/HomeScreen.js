import React, { PureComponent, Component } from 'react';

import {
  Row,
  Accordion,
  Card,
  ListGroup,
  Button,
} from 'react-bootstrap'

import moment from 'moment'
import PropTypes from "prop-types";

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/styles/prism";


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
  FaExclamationCircle,
} from 'react-icons/fa';

console.log('SyntaxHighlighter.supportedLanguages', SyntaxHighlighter.supportedLanguages)

const children = `
  import React, { Component } from 'react';
  import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light';
  import codestyle from 'react-syntax-highlighter/dist/styles/dark';
  import js from 'react-syntax-highlighter/dist/languages/javascript';

  function getAnimal() {
    const animal = 'cat';
    return animal.toUpperCase();
  }

  const ourAnimal = getAnimal();
  console.log(ourAnimal);
`;

class CodeBlock extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string
  };

  static defaultProps = {
    language: null
  };

  render() {
    const { language, value } = this.props;
    return (
      <SyntaxHighlighter language={language} style={docco}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default class HomeScreen extends Component {
  onSidebarClick = selected => {
    console.log('selected', selected)
    if (selected.substring(0,4) === 'repo') {
      this.props.onSelectRepo(selected.substring(4, selected.length))
    }
    if (selected === 'Log Out') {
      this.props.onLogOut()
    }
    if (selected === 'gists') {
      this.props.onShowGists()
    }
  }

  renderRepos = () => {
    return this.props.currentUserRepos.map(repo => {
      return (
        <NavItem eventKey={'repo' + repo.name}>
          <NavText onClick={() => console.log('sdjshjs')}>
            {repo.name}
          </NavText>
        </NavItem>
      )
    })
  }

  renderSearchedRepos() {
    return this.props.renderRepos && this.props.searchedRepos.map(repo => {
      return (
        <Card style={{ width: '60vw', margin: 15, padding: 35 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Card.Img variant="top" src={repo.owner.avatar_url} style={{ width: '20%', height: '30%' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {moment(repo.created_at).fromNow()}
              <Button style={{ height: 50 }}>
                <FaStar /> Star
              </Button>
            </div>
          </div>
          <Card.Body>
            <Card.Title 
              onClick={() => window.open(repo.html_url)} 
              style={{ color: '#007bff', fontSize: 40 }}
            >
              {repo.name}
            </Card.Title>
            <Card.Text>
              {repo.description}
            </Card.Text>
            <Card.Link href={repo.html_url}><FaGithub style={{ marginRight: 5 }} />GitHub</Card.Link>
            <Card.Link href={repo.homepage}><FaBook style={{ marginRight: 5 }} />Homepage</Card.Link>
          </Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item
              action
              href={`https://github.com/${repo.owner.login}/${repo.name}/issues`}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaExclamationCircle style={{ marginRight: 5 }} />
              Issues: {repo.open_issues}
            </ListGroup.Item>

            <ListGroup.Item style={{ display: 'flex', alignItems: 'center' }}><FaStar style={{ marginRight: 5 }}/>Stars: {repo.stargazers_count}</ListGroup.Item>
            <ListGroup.Item style={{ display: 'flex', alignItems: 'center' }}><FaUsers style={{ marginRight: 5 }}/>Watchers: {repo.watchers_count}</ListGroup.Item>
            <ListGroup.Item style={{ display: 'flex', alignItems: 'center' }}><FaCodeBranch style={{ marginRight: 5 }}/>Forks: {repo.forks}</ListGroup.Item>
          </ListGroup>
        </Card>
      )
    })
  }

  getFirstFile = (gist) => {
    return Object.keys(gist.files)[0]
  }

  getGistContent = async(id) => {
    const options = {
      json: true,
      method: 'GET',
      headers: { "Authorization": `token ${this.props.token}`.split('&')[0] }
    }
    const response = await fetch(`https://api.github.com/gists/${id}`, options)
    const gistData = await response.json()
    if (gistData.message !== 'Not Found') {
      let gist = await gistData.files[this.getFirstFile(gistData)]
      if (gist.language === 'JavaScript') {
        console.log('gist.content', typeof gist.content)
        console.log('gist.content type', gist.content)
        const content = gist.content.toString()
        return content
      }
      return "console.log('go')"
    }
    return "console.log('go')"
  }

  renderGists() {
    return this.props.gists.map((gist) => {
      return (
        <Card style={{ width: '60vw', margin: 15, padding: 35 }}>
          <Card.Body>
            <Card.Title 
              style={{ color: '#007bff', fontSize: 30 }}
            >
              {this.getFirstFile(gist)}
            </Card.Title>
            <Card.Text>
            {/* <SyntaxHighlighter language="jsx" style={coy}>{children}</SyntaxHighlighter> */}
            <CodeBlock 
             language="jsx"
             value={children}
            />
            </Card.Text>
            <Card.Link href={gist.html_url}><FaGithub style={{ marginRight: 5 }} />GitHub</Card.Link>
            <Card.Link href={gist.html_url}><FaBook style={{ marginRight: 5 }} />{moment(gist.created_at).fromNow()}</Card.Link>
          </Card.Body>
        </Card>
      )
    })
  }

  render() {
    return (
      <div className="main">
        <SideNav
          onSelect={this.onSidebarClick}
          style={{
            backgroundColor: '#40434E'
          }}
        >
          <SideNav.Toggle />
          <SideNav.Nav defaultSelected="home">
            <NavItem eventKey="home">
              <NavIcon>
                <FaHome />
              </NavIcon>
              <NavText>
                Home
              </NavText>
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
              <NavText>
                Gists
              </NavText>
            </NavItem>
            <NavItem eventKey="favorites">
              <NavIcon>
                <FaHeart />
              </NavIcon>
              <NavText>
                Favorites
              </NavText>
              <NavItem eventKey={'repo'}>
                <NavText>
                  Hittiti
                </NavText>
              </NavItem>
              <NavItem eventKey={'repo'}>
                <NavText>
                  Hittiti
                </NavText>
              </NavItem>
              <NavItem eventKey={'repo'}>
                <NavText>
                  Hittiti
                </NavText>
              </NavItem>
              <NavItem eventKey={'repo'}>
                <NavText>
                  Hittiti
                </NavText>
              </NavItem>
            </NavItem>
          <NavItem eventKey="Log Out" className="logout">
            <NavIcon>
              <FaSignOutAlt />
            </NavIcon>
            <NavText>
              Log Out
            </NavText>
          </NavItem>
          </SideNav.Nav>
        </SideNav>
        <Row style={{ marginLeft: 300, overflowY: 'scroll', height: '100vh' }}>
          {this.props.renderRepos && this.renderSearchedRepos()}
          {this.props.renderGists && this.renderGists()}
        </Row>
      </div>
    )
  }
}
