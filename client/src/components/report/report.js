import React, {useEffect, useState} from 'react';
import './report.css'
import {withRouter} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import auth from "../../services/auth";
import Input from '@material-ui/core/Input';

function Report(props) {
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [text, setText] = useState('');
    const [dialog, setDialog] = useState(false);
    

    useEffect(() => {
        getReport();
    },[limit]);
    
    function closeDialog() {
        setDialog(false);
    }

    function getReport() {
        axios.get('http://localhost:8000/playlists', {
            params: {
                limit: limit
            }
        }).then((response) => {
            console.log(response.data);
            setData(response.data);
        }).catch(error => {
            console.warn(error);
        });
    }

    function openDialog() {
        setDialog(true);

    }

    function createPlaylist() {
        if (text !== '') {
            const user = JSON.parse(localStorage.getItem('user'));
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            const data = {
                name: text,
                userId: user[0].id,
                creationDate: today
            };
            axios.post("http://localhost:8000/playlist", data).then(resp => {
                closeDialog();
                getReport();
            }).catch(err => {
                console.warn(err.response.data);
            })
        }
    }

    return (
        <div className={"report-container"}>
            <h2 style={{textAlign: "center"}}> Playlists</h2>
            { auth.isAuthenticated() &&
                    <Button
                        style={{
                            margin: '24px 0',
                        }}
                        disableElevation
                        variant="outlined"
                        size="large"
                        fullWidth
                        color="primary"
                        onClick={openDialog}
                    >
                        {"Create"} Playlist
                    </Button>
                }
            <Dialog onClose={closeDialog} open={dialog}>
                    <DialogTitle onClose={closeDialog}
                        style={{
                            width: '500px',
                        }}
                    >
                        New Playlist
                    </DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <Input
                                value={text}
                                onChange={(e)=>setText(e.target.value)}
                                label="Playlist Name"
                                multiline
                                rows={1}
                                variant="outlined"
                                placeholder="Playlist Name"
                                fullWidth
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={createPlaylist} color="primary" variant="outlined">
                            Create Playlist
                        </Button> 
                        <Button autoFocus onClick={closeDialog} color="default">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            {data.length > 0 ?
                <div className={"flexer"}>
                    <Grid container spacing={0}>
                        {data.map((game, index)=> (
                            <Button key={index} container item spacing={0} xs={12}>

                                { <div className={"game-block"}>
                                    <div className={"name-block"}>
                                        {game.name}
                                    </div>
                                </div> }
                            </Button>
                        ))}
                    </Grid>
                </div>:
                <CircularProgress />
            }
        </div>
    )
}

export default withRouter(Report);
