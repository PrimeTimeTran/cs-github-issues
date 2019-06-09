import React from 'react';
import {
  Form,
  Button,
  Navbar,
  InputGroup,
  FormControl,
} from 'react-bootstrap'

import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

import AuthenticationScreen from './screens/AuthenticationScreen'
import HomeScreen from './screens/HomeScreen'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      currentUser: {},
      renderRepos: true,
      _searchedRepos: [],
      get searchedRepos() {
        return this._searchedRepos;
      },
      set searchedRepos(value) {
        this._searchedRepos = value;
      },
      currentUserRepos: [],
      repoSearchTerm: 'react'
    }
  }

  async componentDidMount() {
    this.setupCurrentUser()
    const response = await fetch(`https://api.github.com/search/repositories?q=${this.state.repoSearchTerm}`)
    const jsonData = await response.json()
    console.log('jsonData', jsonData)

    this.setState({ searchedRepos: jsonData.items })
  }

  setupCurrentUser() {
    const existingToken = sessionStorage.getItem('token');
    const accessToken = (window.location.search.split("=")[0] === "?access_token") ? window.location.search.split("=")[1] : null;
    const clientId = process.env.REACT_APP_CLIENT_ID;

    if (!accessToken && !existingToken) {
      window.location.replace(`https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientId}`)
    }

    if (accessToken) {
      sessionStorage.setItem("token", accessToken);
      this.storeUserLocal(accessToken)
    }

    if (existingToken) {
      this.storeUserLocal(existingToken)
    }
  }

  storeUserLocal(token) {
    this.setState({ token }, this.getCurrentUser)
  }

  async getCurrentUser() {
    const options = {
      json: true,
      method: 'GET',
      headers: {
        "Authorization": `token ${this.state.token}`.split('&')[0],
      },
    }
    const response = await fetch('https://api.github.com/user', options)
    const currentUser = await response.json()

    if (currentUser) {
      this.setState({ currentUser }, this.getCurrentUserRepos)
    }
  }

  getCurrentUserRepos = async() => {
    const options = {
      method: 'GET',
      headers: {
        "Authorization": `token ${this.state.token}`.split('&')[0],
      },
      json: true,
    }
    const response = await fetch('https://api.github.com/user/repos', options)
    const currentUserRepos = await response.json()

    this.setState({ currentUserRepos }, this.getFavoriteRepos)
  }

  getFavoriteRepos() {
    const favoriteRepos = sessionStorage.getItem('favoriteRepos');
    console.log('favoriteRepos', favoriteRepos)

    this.getCurrentUserGists()
  }

  async getCurrentUserGists() {
    const options = {
      method: 'GET',
      headers: {
        "Authorization": `token ${this.state.token}`.split('&')[0],
      },
      json: true,
    }
    const response = await fetch('https://api.github.com/gists', options)
    const gists = await response.json()
    this.setState({ 
      gists
    })
  }

  async onSelectRepo(name) {
    console.log('onSelectRepo')
    const response = await fetch(`https://api.github.com/repos/primetimetran/${name}/commits`)
    const repoInfo = await response.json()
  }

  onLogOut = () => {
    sessionStorage.removeItem("token");
    this.setState({ currentUser: null })
  }

  onRepoSearch = async(e) => {
    console.log('onRepoSearch')
    e.preventDefault()
    const response = await fetch(`https://api.github.com/search/repositories?q=${this.state.repoSearchTerm}`)
    const jsonData = await response.json()

    this.setState({ searchedRepos: jsonData.items })
  }

  onShowGists = () => {
    this.setState({ 
      renderGists: true,
      renderRepos: false,
    })
  }

  onSearching = e => {
    this.setState({ repoSearchTerm: e.target.value })
  }

  renderNavBar() {
    return (
      <Navbar className="justify-content-between" style={{ backgroundColor: '#080705', paddingLeft: 55 }}>
        <Form inline>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Username"
              aria-describedby="basic-addon1"
              placeholder={this.state.currentUser && this.state.currentUser.login || 'Username'}
            />
          </InputGroup>
        </Form>
        <Form inline onSubmit={(e) => this.onRepoSearch(e)}>
          <FormControl type="text" placeholder="Search" onChange={this.onSearching} className=" mr-sm-2" />
          <Button type="submit">Submit</Button>
        </Form>
      </Navbar>
    )
  }

  renderAuthenticatedRoute() {
    if (this.state.currentUser !== null) {
      return (
        <Route
          path="/"
          render={routeProps => (
            <HomeScreen
              {...routeProps}
              {...this.state}
              onLogOut={this.onLogOut}
              onShowGists={this.onShowGists}
              onSelectRepo={name => this.onSelectRepo(name)}
            />
          )}
        />
      )
    }
    return <Route path="/" exact component={AuthenticationScreen} />
  }

  render() {
    return (
      <div>
        {this.renderNavBar()}
        <Router>
          {this.renderAuthenticatedRoute()}
        </Router>
      </div>
    );
  }
}

export default App;
