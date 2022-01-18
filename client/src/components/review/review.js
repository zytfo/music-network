import React, {useState, useEffect} from "react";
import "./review.css"
import {withRouter} from 'react-router-dom';
import axios from "axios";
import auth from "../../services/auth";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import { ThemeProvider } from "@material-ui/core";
import {createTheme} from "@material-ui/core";

function Review(props) {
    const [playlists, setPlaylists] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [playlistIdReview, setPlaylistIdReview] = useState("");
    const [userId, setUserId] = useState(null);
    const [isMusician, setIsMusician] = useState(false);
    const [hasReview, setHasReview] = useState(false);
    const [userName, setUsername] = useState(false);

    useEffect(() => {
        getPlaylist();
        getReviews();
        setUserId(JSON.parse(auth.token)[0]["id"]);
        let userMus = JSON.parse(auth.token)[0]["isMusician"];
        if (userMus == 1) {
            setIsMusician(true);
        } else {
            setIsMusician(false);
        }
    }, []);

    function getPlaylist() {
        axios.get('http://localhost:8000/playlists', {}).then((response) => {
            console.log(response.data);
            setPlaylists(response.data);
            setLoading(false);
        }).catch(error => {
            console.warn(error);
        }).finally();
    }

    function getReviews() {
        axios.get('http://localhost:8000/reviews', {}).then((response) => {
            console.log(response.data);
            setReviews(response.data);
            setLoading(false);
        }).catch(error => {
            console.warn(error);
        });
    }

    function publishReview() {
        if (text !== '') {
            const data = {
                playlistId: playlistIdReview,
                userId: userId,
                rating: rating,
                comment: text
            };
            axios.post("http://localhost:8000/review", data).then(resp => {
                closeDialog();
                getReviews();
            }).catch(err => {
                console.warn(err.response.data);
            })
        }
    }

    function openDialog() {
        setDialog(true);
    }

    function closeDialog() {
        setDialog(false);
    }

    const AmountSlider = createTheme({
        overrides: {
            MuiSlider: {
                root: {
                    color: rating < 50 ? '#e2553e' : rating <=70 ? '#e2c776' : '#52af77',
                    height: 8,
                },
                thumb: {
                    height: 24,
                    width: 24,
                    backgroundColor: '#fff',
                    border: '2px solid currentColor',
                    marginTop: -8,
                    marginLeft: -12,
                    '&:focus, &:hover, &$active': {
                        boxShadow: 'inherit',
                    },
                },
                active: {},
                track: {
                    height: 8,
                    borderRadius: 4,
                },
                rail: {
                    height: 8,
                    borderRadius: 4,
                },
            }
        }
    });

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    return (
        <div className={"rev-container"}>
            <div className={"review-cont"}>
                <h2>Reviews</h2>
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
                        {hasReview ? "Modify" : "Write"} Review
                    </Button>
                }
                {reviews ?
                    <div>
                        { reviews.length === 0 && <div className={"no-review-header"}> No reviews found. Wanna add one?</div>}
                        <Grid container spacing={2}>
                            {reviews.map((review, index)=> (
                                <Grid key={index} container item spacing={0} xs={12} sm={12} md={6}>
                                    <div className={"review-item-block"}>
                                        <h2>{review.name}</h2>
                                        <div className={"review-item-title"}>
                                            <div className={
                                                    `review-item-rating ${review.rating < 20 ? 'bad-rating' : review.rating <= 70 ? 'av-rating' : 'good-rating'}`}
                                            >
                                                {review.rating}
                                            </div>
                                        </div>
                                        <div className={"review-item-text"}>
                                            {review.comment}
                                        </div>
                                        <div className={"review-item-user"}>
                                            author: {review.username}
                                        </div>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </div>:
                    <div style={{ textAlign: 'center' }}>
                        <CircularProgress />
                    </div>
                }
                <Dialog onClose={closeDialog} open={dialog}>
                    <DialogTitle onClose={closeDialog}
                        style={{
                            width: '500px',
                        }}
                    >
                        Leave a Review
                    </DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <TextField
                                value={playlistIdReview}
                                onChange={(e)=>setPlaylistIdReview(e.target.value)}
                                label="Playlist ID"
                                multiline
                                rows={1}
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                        <div className={"dialog-slider"}>
                            <Typography>
                                Rating - <span style={{color: rating < 50 ? '#e2553e' : rating <=70 ? '#e2c776' : '#52af77'}}>{rating}</span>
                            </Typography>
                            <ThemeProvider theme={AmountSlider}>
                                <Slider
                                    valueLabelDisplay="auto"
                                    value={rating}
                                    onChange={(event, nextValue)=>setRating(nextValue)}
                                    step={1}
                                    min={0}
                                    max={100}
                                />
                            </ThemeProvider>
                        </div>
                        <div>
                            <TextField
                                value={text}
                                onChange={(e)=>setText(e.target.value)}
                                label="Review"
                                multiline
                                rows={8}
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={publishReview} color="primary" variant="outlined">
                            Publish Review
                        </Button>
                        <Button autoFocus onClick={closeDialog} color="default">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default withRouter(Review);