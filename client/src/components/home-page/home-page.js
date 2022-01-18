import React, {useEffect, useState, useMemo} from 'react';
import axios from 'axios';
import "./home-page.css";
import Grid from "@material-ui/core/Grid";
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from '@material-ui/core/Input';
import auth from "../../services/auth";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {withRouter} from "react-router-dom";

function HomePage(props) {
    const [songs, setSongs] = useState(null);
    const [songsFullList, setSongsFullList] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [songName, setSongName] = useState('');
    const [duration, setDuration] = useState('');
    const [genre, setGenre] = useState('');
    const [album, setAlbum] = useState('');
    const [releaseDate, setReleaseDate] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [isMusician, setIsMusician] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/songs', {}).then((response) => {
            setSongs(response.data);
            setSongsFullList(response.data);
            setLoading(false);
        }).catch(error => {
            console.warn(error);
        });
        let userMus = JSON.parse(auth.token)[0]["isMusician"];
        setUserId(JSON.parse(auth.token)[0]["id"]);
        if (userMus == 1) {
            setIsMusician(true);
        } else {
            setIsMusician(false);
        }
    }, []);

    function goToSongDetails(id) {
        props.history.push(`/song/${id}`);
        const data = {
            id: id
        };
        axios.post(
            'http://localhost:8000/popularity-update', data
        ).then(resp => {
        }).catch(error => {
            console.warn(error);
        });
    }

    function secondsToTime(e){
        var h = Math.floor(e / 3600).toString().padStart(2,'0'),
            m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
            s = Math.floor(e % 60).toString().padStart(2,'0');
        return m + ':' + s;
    }    

    function withoutTime(dateTime) {
        var dateData, dateObject, dateReadable;
        dateObject = new Date(Date.parse(dateTime));
        dateReadable = dateObject.toDateString();
        return dateReadable;
    }

    function findSongs(event) {
        const value = event.target.value;
        let songsTemp = songs;
        setSongs(songsFullList.filter((song) => {
            return song.name.toLowerCase().includes(value.toLowerCase());
        }));
    }

    function openDialog() {
        setDialog(true);
    }

    function closeDialog() {
        setDialog(false);
    }

    function addNewSong() {
        if (songName !== '' && duration !== '' && genre !== '' && album !== '') {
            const user = JSON.parse(localStorage.getItem('user'));
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            const data = {
                userId: userId,
                name: songName,
                duration: parseInt(duration),
                genre: genre,
                album: album,
                releaseDate: today,
                isMusician: 1
            };
            axios.post("http://localhost:8000/song", data).then(resp => {
                closeDialog();
                // getReport();
            }).catch(err => {
                console.warn(err.response.data);
            })
        }
    }

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div className={"page-container"}>
            <h2 style={{textAlign: "center"}}>Songs</h2>
            <div className={"search-bar"}>
                <Input placeholder="Search" onChange={(e) => findSongs(e)}/>
            </div>

            

            {/* {songs ?
                <Grid className={"song-container"} container spacing={8}>
                    {songs.map((song, index)=> (
                        <Grid key={index} container item spacing={3} xs={12} sm={6} md={3}>
                            <div className={"song-card"}
                                 style={{
                                     backgroundImage: 'url(' + require(`../../assets/posters/${index + 1 > 7 ? 7 : index+1}.jpg`) + ")",
                                     backgroundSize: 'cover',
                                     backgroundPosition: 'center'
                                 }}
                                 onClick={()=>goToSongDetails(song.id)}>
                                <div className={"song-info"} style={{
                                    color: 'white',
                                    backgroundColor: 'black'
                                }}>
                                    {song.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid> :
                <CircularProgress />
            } */}
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
                    <TableCell align="right">Artist</TableCell>
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
                        <TableCell align="right">{song.username}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            {isMusician &&
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
                        Add Song
                    </Button>
            }
            <Dialog onClose={closeDialog} open={dialog}>
                    <DialogTitle onClose={closeDialog}
                        style={{
                            width: '500px',
                        }}
                    >
                        New Song
                    </DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <Input
                                value={songName}
                                onChange={(e)=>setSongName(e.target.value)}
                                label="Name"
                                multiline
                                rows={1}
                                variant="outlined"
                                placeholder="Name"
                                fullWidth
                            />
                            <Input
                                value={duration}
                                onChange={(e)=>setDuration(e.target.value)}
                                label="Duration"
                                multiline
                                rows={1}
                                variant="outlined"
                                placeholder="Duration"
                                fullWidth
                            />
                            <Input
                                value={genre}
                                onChange={(e)=>setGenre(e.target.value)}
                                label="Genre"
                                multiline
                                rows={1}
                                variant="outlined"
                                placeholder="Genre"
                                fullWidth
                            />
                            <Input
                                value={album}
                                onChange={(e)=>setAlbum(e.target.value)}
                                label="Album"
                                multiline
                                rows={1}
                                variant="outlined"
                                placeholder="Album"
                                fullWidth
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={addNewSong} color="primary" variant="outlined">
                            Add Song
                        </Button> 
                        <Button autoFocus onClick={closeDialog} color="default">
                            Cancel
                        </Button>
                    </DialogActions>
            </Dialog>
        </div>
    )
}

export default withRouter(HomePage);
