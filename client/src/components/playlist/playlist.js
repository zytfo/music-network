import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Input from '@material-ui/core/Input';
import auth from "../../services/auth";
import './playlist.css'

function Playlist(props) {
    const [playlists, setPlaylists] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [songs, setSongs] = useState([]);
    const [songsFullList, setSongsFullList] = useState([]);
    const [text, setText] = useState('');
    const [dialog, setDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [addSongDialog, setAddSongDialog] = useState(false);
    const [isMusician, setIsMusician] = useState(false);
    const [userId, setUserId] = useState(null);
    
    useEffect(() => {
        getPlaylist();
        let userMus = JSON.parse(auth.token)[0]["isMusician"];
        setUserId(JSON.parse(auth.token)[0]["id"]);
        if (userMus == 1) {
            setIsMusician(true);
        } else {
            setIsMusician(false);
        }
    }, []);

    function getPlaylistSongs(playlistId) {
        axios.get('http://localhost:8000/playlist', {
            params: {
                playlistId: playlistId
            }
        }).then((response) => {
            setSongs(response.data);
            setLoading(false);
        }).catch(error => {
            console.warn(error);
        });
    }

    function getSongs() {
        axios.get('http://localhost:8000/songs', {}).then((response) => {
            setSongsFullList(response.data);
            setLoading(false);
        }).catch(error => {
            console.warn(error);
        });
    }

    function getPlaylist() {
        axios.get('http://localhost:8000/playlists', {}).then((response) => {
            console.log(response.data);
            setPlaylists(response.data);
            setLoading(false);
        }).catch(error => {
            console.warn(error);
        });
    }

    function openDialog() {
        setDialog(true);
    }

    function closeDialog() {
        setDialog(false);
    }

    function openEditDialog(playlistId) {
        getPlaylistSongs(playlistId);
        setEditDialog(true);
    }

    function closeEditDialog() {
        setEditDialog(false);
    }

    function openAddSongDialog() {
        getSongs();
        setAddSongDialog(true);
    }

    function closeAddSongDialog() {
        setAddSongDialog(false);
    }

    function createPlaylist() {
        if (text !== '') {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            const data = {
                name: text,
                userId: userId,
                creationDate: today
            };
            axios.post("http://localhost:8000/playlist", data).then(resp => {
                closeDialog();
                getPlaylist();
            }).catch(err => {
                console.warn(err.response.data);
            })
        }
    }

    function editPlaylist() {
        if (text !== '') {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            const data = {
                name: text,
                userId: userId,
                creationDate: today
            };
            axios.post("http://localhost:8000/playlist", data).then(resp => {
                closeDialog();
                getPlaylist();
            }).catch(err => {
                console.warn(err.response.data);
            })
        }
    }

    function withoutTime(dateTime) {
        var dateData, dateObject, dateReadable;
        dateObject = new Date(Date.parse(dateTime));
        dateReadable = dateObject.toDateString();
        return dateReadable;
    }

    function secondsToTime(e){
        var h = Math.floor(e / 3600).toString().padStart(2,'0'),
            m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
            s = Math.floor(e % 60).toString().padStart(2,'0');
        return m + ':' + s;
    }  

    const IndeterminateCheckbox = React.forwardRef(
        ({ indeterminate, ...rest }, ref) => {
          const defaultRef = React.useRef()
          const resolvedRef = ref || defaultRef
      
          React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
          }, [resolvedRef, indeterminate])
      
          return (
            <>
              <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
          )
        }
    )

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    function addSongsToPlaylist() {
        // routine
    }

    return (
        <div className={"playlist-container"}>
            <h2 style={{textAlign: "center"}}>ALL PLAYLISTS</h2>
                {auth.isAuthenticated() &&
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
                        Create Playlist
                    </Button>
                }
                <Dialog onClose={closeDialog} open={dialog}>
                    <DialogTitle onClose={closeDialog}
                        style={{
                            width: '500px',
                    }}>
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
                <div className={"flexer"}>
                    <Grid container spacing={0}>
                        {playlists.map((playlist, index)=> (
                            <Grid key={index} container item spacing={0} xs={12}>
                                <div className={"playlist-block"}>
                                    <div className={"name-block"}>
                                        {playlist.id}, {playlist.name}, Date: {withoutTime(playlist.creationDate)}
                                    </div>
                                </div>
                                {auth.isAuthenticated() &&
                                    <Button
                                        style={{
                                            margin: 'auto',
                                        }}
                                        disableElevation
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        color="primary"
                                        onClick={() => openEditDialog(playlist.id)}
                                    >
                                        Edit
                                    </Button>
                                }
                                <Dialog onClose={closeEditDialog} open={editDialog}>
                                    <DialogTitle onClose={closeEditDialog}
                                        style={{
                                            width: '500px',
                                    }}>
                                        Edit Playlist
                                    </DialogTitle>
                                    <DialogContent dividers>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                            <TableCell>No</TableCell>
                                            <TableCell align="right">Name</TableCell>
                                            <TableCell align="right">Album</TableCell>
                                            <TableCell align="right">Genre</TableCell>
                                            <TableCell align="right">Duration</TableCell>
                                            <TableCell align="right">Release Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {songs.map((song) => (
                                                <TableRow key={song.id}>
                                                    <TableCell component="th" scope="row">
                                                        {song.id}
                                                    </TableCell>
                                                    <TableCell align="right">{song.name}</TableCell>
                                                    <TableCell align="right">{song.album}</TableCell>
                                                    <TableCell align="right">{song.genre}</TableCell>
                                                    <TableCell align="right">{secondsToTime(song.duration)}</TableCell>
                                                    <TableCell align="right">{withoutTime(song.releaseDate)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        </Table>
                                    </TableContainer>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button autoFocus onClick={openAddSongDialog} color="primary" variant="outlined">
                                            Add Song
                                        </Button>
                                        <Button autoFocus onClick={editPlaylist} color="primary" variant="outlined">
                                            Save
                                        </Button>
                                        <Button autoFocus onClick={closeEditDialog} color="default">
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog onClose={closeAddSongDialog} open={addSongDialog}>
                                    <DialogTitle onClose={closeAddSongDialog}
                                        style={{
                                            width: '500px',
                                    }}>
                                        Add Song
                                    </DialogTitle>
                                    <DialogContent dividers>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                            <TableCell>No</TableCell>
                                            <TableCell align="right">Name</TableCell>
                                            <TableCell align="right">Album</TableCell>
                                            <TableCell align="right">Genre</TableCell>
                                            <TableCell align="right">Duration</TableCell>
                                            <TableCell align="right">Release Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {songsFullList.map((song) => (
                                            <TableRow key={song.id}>
                                                <TableCell component="th" scope="row">
                                                    {song.id}
                                                </TableCell>
                                                <TableCell align="right">{song.name}</TableCell>
                                                <TableCell align="right">{song.album}</TableCell>
                                                <TableCell align="right">{song.genre}</TableCell>
                                                <TableCell align="right">{secondsToTime(song.duration)}</TableCell>
                                                <TableCell align="right">{withoutTime(song.releaseDate)}</TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                        </Table>
                                    </TableContainer>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button autoFocus onClick={addSongsToPlaylist} color="primary" variant="outlined">
                                            Add Songs
                                        </Button> 
                                        <Button autoFocus onClick={closeAddSongDialog} color="default">
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Grid>
                        ))}
                    </Grid>
                </div>:
        </div>
    )
}

export default withRouter(Playlist);
