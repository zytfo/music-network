import React, {useState, useEffect} from "react";
import "./details.css"
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
import {createMuiTheme} from "@material-ui/core";

export default function GameDetails(props) {
    const [gameDetails, setGameDetails] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [rating, setRating] = useState(75);
    const [text, setText] = useState('');

    const [hasReview, setHasReview] = useState(false);

    useEffect(() => {
        const playlistId = props.match.params.id;
        getReviews(playlistId);
    },[]);

    function getReviews(playlistId) {
        axios.get("http://localhost:8000/review", {
            params: {
                playlistId: playlistId
            }
        }).then( resp => {
            console.log(resp.data);
            const rvws = resp.data;
            setReviews(rvws);
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(rvws)
            for (let i = 0; i < rvws.length; i++) {
                if (rvws[i].userId === user[0].id) {
                    console.log(rvws)
                    setHasReview(true);
                    setRating(rvws[i].rating);
                    setText(rvws[i].comment);
                }
            }
        }).catch( err => {
            console.log(err);
        })
    }

    function publishReview() {
        if (text !== '') {
            const user = JSON.parse(localStorage.getItem('user'));
            const data = {
                playlistId: props.match.params.id,
                userId: user[0].id,
                rating: rating,
                comment: text
            };
            axios.post("http://localhost:8000/review", data).then(resp => {
                closeDialog();
                getReviews(data.playlistId);
            }).catch(err => {
                console.warn(err.response.data);
            })
        }
    }

    function modifyReview() {
        if (text !== '') {
            const user = JSON.parse(localStorage.getItem('user'));
            const data = {
                playlistId: props.match.params.id,
                userId: user[0].id,
                rating: rating,
                comment: text
            };
            axios.put("http://localhost:8000/review", data, {
                params: {
                    userId: user[0].id,
                    playlistId: props.match.params.id
                }
            }).then(resp => {
                closeDialog();
                getReviews(data.playlistId);
            }).catch(err => {
                console.warn(err.response.data);
            })
        }
    }

    function beautifyDate(date) {
        const temp = new Date(date);
        return temp.toLocaleDateString();
    }

    function openDialog() {
        setDialog(true);
    }

    function closeDialog() {
        setDialog(false);
    }

    function gameWasReleased() {
        const currentDate = new Date();
        if (gameDetails) {
            const gameDate = new Date(gameDetails.releaseDate);
            return gameDate <= currentDate;
        }
        return true;
    }

    const AmountSlider = createMuiTheme({
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

    return (
        <div className={"details-container"}>
            <div className={"review-cont"}>
                <span className={"review-header"}>Reviews</span>
                { auth.isAuthenticated() && gameWasReleased() &&
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
                {
                    reviews ?
                    <div>
                        { reviews.length === 0 && <div className={"no-review-header"}> No reviews found. Wanna add one?</div>}
                        <Grid container spacing={2}>
                            {reviews.map((review, index)=> (
                                <Grid key={index} container item spacing={0} xs={12} sm={12} md={6}>
                                    <div className={"review-item-block"}>
                                        <div className={"review-item-title"}>
                                            <span className={"review-item-username"}>{review.username}<br/>
                                            </span>
                                            <div
                                                className={
                                                    `review-item-rating ${review.rating < 50 ? 'bad-rating' : review.rating <= 70 ? 'av-rating' : 'good-rating'}`
                                                }
                                            >
                                                {review.rating}
                                            </div>
                                        </div>
                                        <div className={"review-item-text"}>
                                            {review.comment}
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
                        New Review
                    </DialogTitle>
                    <DialogContent dividers>
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
                        { !hasReview ?
                            <Button autoFocus onClick={publishReview} color="primary" variant="outlined">
                                Publish Review
                            </Button> :
                            < Button autoFocus onClick={modifyReview}color="primary" variant="outlined">
                            Modify Review
                            </Button>
                        }
                        <Button autoFocus onClick={closeDialog} color="default">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}
