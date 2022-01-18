import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import "./app-bar.css";
import {withRouter} from "react-router-dom";
import auth from "../../services/auth";
import axios from "axios";

function MyAppBar(props) {

    function migrate() {
        axios.get('http://localhost:8000/migrate', {
        }).then((response) => {
            console.log(response.data);
        }).catch(error => {
            console.warn(error);
        });
    }

    function logOut() {
        auth.logout();
        props.history.push('/login');
    }

    return (
        <AppBar position="static" color={"primary"}>
            <Toolbar>
                <div className={"title"}>
                    MUSIC NETWORK
                </div>
                <Button color="inherit" onClick={migrate}>MIGRATE</Button>
                <Button color="inherit" onClick={() => props.history.push('/')}>Home</Button>
                {auth.isAuthenticated() && <Button color="inherit" onClick={() => props.history.push('/playlist')}>Playlists</Button>}
                {auth.isAuthenticated() && <Button color="inherit" onClick={() => props.history.push('/review')}>Reviews</Button>}
                {auth.isAuthenticated() ?
                    <Button color="inherit" onClick={logOut}>Log Out</Button> :
                    <Button color="inherit" onClick={() => props.history.push('/login')}>Log In</Button>
                }
                {!auth.isAuthenticated() && <Button color="inherit" onClick={() => props.history.push('/register')}>Create Account</Button>}
            </Toolbar>
        </AppBar>
    )
}

export default withRouter(MyAppBar);
