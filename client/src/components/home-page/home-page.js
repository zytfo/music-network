import React, {useEffect, useState} from 'react';
import axios from 'axios';
import "./home-page.css";
import Grid from "@material-ui/core/Grid";
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from '@material-ui/core/Input';
import {withRouter} from "react-router-dom";

function HomePage(props) {
    const [songs, setSongs] = useState(null);
    const [gamesFullList, setFullList] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/songs', {
        }).then((response) => {
            setSongs(response.data);
            setFullList(response.data);
        }).catch(error => {
            console.warn(error);
        });
    },[]);

    function goToGameDetails(id) {
        props.history.push(`/game/${id}`);
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

    function findSongs(event) {
        const value = event.target.value;
        setSongs(gamesFullList.filter((song) => {
            return song.name.toLowerCase().includes(value.toLowerCase());
        }));
    }

    return (
        <div className={"page-container"}>
            <div className={"search-bar"}>
            <Input placeholder="Search" onChange={(e) => findSongs(e)}/>
            </div>
            {songs ?
                <Grid className={"game-container"} container spacing={8}>
                    {songs.map((song, index)=> (
                        <Grid key={index} container item spacing={3} xs={12} sm={6} md={3}>
                            <div className={"game-card"}
                                 style={{
                                     backgroundImage: 'url(' + require(`../../assets/posters/${index + 1 > 7 ? 7 : index+1}.jpg`) + ")",
                                     backgroundSize: 'cover',
                                     backgroundPosition: 'center'
                                 }}
                                 onClick={()=>goToGameDetails(song.id)}
                            >
                                <div className={"game-info"} style={{
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
            }

        </div>
    )
}

export default withRouter(HomePage);
