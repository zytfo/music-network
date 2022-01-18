import React from 'react';
import './App.css';
import auth from "./services/auth";
import {HashRouter} from "react-router-dom";
import { Route, Switch, Redirect } from 'react-router-dom'
import HomePage from "./components/home-page/home-page";
import MyAppBar from "./components/app-bar/app-bar";
import Login from "./components/login/login";
import Register from "./components/register/register";
import Playlist from "./components/playlist/playlist"
import Review from "./components/review/review"

function LoggedRoutes() {
    return (
        <Switch>
            <Route path="/playlist" component={Playlist}/>
            <Route path="/review" component={Review}/>
            <Redirect from="*" to="/"/>
        </Switch>
    );
}

function ProtectedRoute({component: Component, ...rest}) {
    return (
        <Route
            {...rest}
            render={props =>
                auth.isAuthenticated() ?
                    <Component {...props} />
                    : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location },
                            }}
                        />
                    )
            }
        />
    )
}

function App() {
  return (
      <HashRouter>
          <main>
              <div className={"container"}>
                  <MyAppBar />
                  <Switch>
                      <Route exact path="/" component={HomePage}/>
                      <Route path="/login" component={Login}/>
                      <Route path="/register" component={Register}/>
                      <ProtectedRoute path="/" component={LoggedRoutes} />
                      <Redirect from="*" to="/"/>
                  </Switch>
              </div>
          </main>
      </HashRouter>
  );
}

export default App;
