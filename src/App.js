import React, { useEffect, useState } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "./App.css";

import Navbar from "./components/Navbar";
import HomeScreen from "./screens/HomeScreen";
import AuthenticationScreen from "./screens/AuthenticationScreen";

function App() {
  const [gists, setGists] = useState([]);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState  ({});
  const [renderRepos, setRenderRepos] = useState(true);
  const [renderGists, setRenderGists] = useState(false);
  const [searchedRepos, setSearchedRepos] = useState([]);
  const [repoSearchTerm, setRepoSearchTerm] = useState("react");
  const [currentUserRepos, setCurrentUserRepos] = useState([]);

  const onLogOut = () => {
    sessionStorage.removeItem("token");
    setCurrentUser(null);
  };

  const onShowGists = () => {
    console.log("onShowGists");
    setRenderRepos(false);
    setRenderGists(true);
  };

  const onShowHome = () => {
    setRenderRepos(true);
    setRenderGists(false);
  };

  const onSelectRepo = async name => {
    const response = await fetch(
      `https://api.github.com/repos/primetimetran/${name}/commits`
    );
    const repoInfo = await response.json();
  };

  const onSearching = e => {
    setRepoSearchTerm(e.target.value);
  };

  const onRepoSearch = async e => {
    e.preventDefault();
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${repoSearchTerm}`
    );
    const jsonData = await response.json();
    setSearchedRepos(jsonData.items);
    setRenderRepos(true);
    setRenderGists(false);
  };

  const getCurrentUserGists = async token => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `token ${token}`.split("&")[0]
      },
      json: true
    };
    const response = await fetch("https://api.github.com/gists", options);
    const gists = await response.json();
    setGists(gists);
  };

  const setupCurrentUser = () => {
    const existingToken = sessionStorage.getItem("token");
    const accessToken =
      window.location.search.split("=")[0] === "?access_token"
        ? window.location.search.split("=")[1]
        : null;
    const clientId = process.env.REACT_APP_CLIENT_ID;
    if (!accessToken && !existingToken) {
      window.location.replace(
        `https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientId}`
      );
    }

    if (accessToken) {
      sessionStorage.setItem("token", accessToken);
      storeUserLocal(accessToken);
    }

    if (existingToken) {
      storeUserLocal(existingToken);
    }
  };

  const storeUserLocal = token => {
    setToken(token);
    getCurrentUser(token);
  };

  const getCurrentUser = async token => {
    const options = {
      json: true,
      method: "GET",
      headers: {
        Authorization: `token ${token}`.split("&")[0]
      }
    };
    const response = await fetch("https://api.github.com/user", options);
    const currentUser = await response.json();

    if (currentUser) {
      setCurrentUser(currentUser);
      getCurrentUserRepos(token);
      getCurrentUserGists(token);
    }
  };

  const getCurrentUserRepos = async token => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `token ${token}`.split("&")[0]
      },
      json: true
    };
    const response = await fetch("https://api.github.com/user/repos", options);
    const currentUserRepos = await response.json();
  };

  useEffect(() => {
    setupCurrentUser();
    const go = async () => {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${repoSearchTerm}`
      );
      const jsonData = await response.json();
      setSearchedRepos(jsonData.items);
    };
    go();
  }, []);

  const renderAuthenticatedRoute = () => {
    if (currentUser !== null) {
      return (
        <Route
          path="/"
          render={routeProps => (
            <HomeScreen
              {...routeProps}
              gists={gists}
              onLogOut={onLogOut}
              onShowHome={onShowHome}
              renderRepos={renderRepos}
              renderGists={renderGists}
              onShowGists={onShowGists}
              searchedRepos={searchedRepos}
              currentUserRepos={currentUserRepos}
              onSelectRepo={name => onSelectRepo(name)}
            />
          )}
        />
      );
    }
    return <Route path="/" exact component={AuthenticationScreen} />;
  };

  return (
    <>
      <Navbar
        onSearching={onSearching}
        onRepoSearch={onRepoSearch}
        currentUser={currentUser}
      />
      <Router>{renderAuthenticatedRoute()}</Router>
    </>
  );
}

export default App;
