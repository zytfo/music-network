const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const app = express();

let db;
let flag = false;

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST_IP,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // host: "localhost",
    // user: "admin",
    // password: "admin",
    // database: "mdb",
});

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
};

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const client = new MongoClient(url);

client.connect(function(err) {
    if (!err) {
        console.log("Connected successfully to server");
        db = client.db(MONGO_DB);
    }
});


app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
    console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});

// app.listen(8000, () => {
//     console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
// });

app.post('/register', (req, res) => {
    const { username } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { isMusician } = req.body;
    let createdUserId;
    if (!flag) {
        pool.query(`INSERT INTO ${'user'}(${'username'}, ${'email'}, ${'password'}) VALUES ('${username}', '${email}', '${password}')`, [], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: "You can't use this username"});
            } else {
                console.log("Success");
                createdUserId = results.insertId;
                pool.query(`INSERT INTO ${'role'}(${'userId'}, ${'isAdmin'}, ${'isMusician'}) VALUES ('${createdUserId}', '${0}', '${isMusician}')`, [], (err, result) => {
                    if (err) {
                        console.log(err);
                        return result.status(400).send({ error: "Something went wrong"});
                    } else {
                        console.log("Success");
                    }
                });
                return res.send(results);
            }
        });
    } else {
        db.collection("user").findOne(
            { username: username},
            (e, resp) => {
                if (resp) return res.status(403).send({ error: "You can't use this username"});
                const post = {
                    username: username,
                    email: email,
                    password: password,
                    isMusician: isMusician
                };
                db.collection("user").insertOne(post);
                return res.send(resp);
            }
        );
    }
});

app.get('/login', (req, res) => {
    const { username } = req.query;
    const { password } = req.query;
    if (!flag) {
        pool.query(`SELECT ${'user.username'}, ${'role.isAdmin'}, ${'role.isMusician'}, ${'user.id'} FROM ${'user'} JOIN ${'role'} ON ${'user.id = role.userId'} WHERE ${'username'}='${username}' AND ${'password'}='${password}'`, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Something went wrong"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(401).send({ error: "No such user"});
            }
        });
    } else {
        db.collection("user").findOne(
            { username: username, password: password},
            { username: 1 },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong"});
                return res.send(resp);
            }
        );
    }
});

app.get('/songs', (req, res) => {
    if (!flag) {
        pool.query(`SELECT song.id, song.name, song.duration, song.genre, song.album, song.releaseDate, user.username FROM ${'song'} JOIN ${'user'} ON ${'song.userId = user.id'}`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(404).send({ error: 'No songs found'});
            }
        });
    } else {
        db.collection("song").find().toArray((e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong"});
            return res.send(resp);
        });
    }
});

app.get('/song', (req, res) => {
    const { songId } = req.query;
    if (!flag) {
        pool.query(`SELECT * FROM ${'song'} WHERE id = '${songId}'`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(404).send({ error: 'No song found'});
            }
        });
    } else {
        db.collection("song").findOne(
            { id: songId },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong"});
                return res.send(resp);
            }
        );
    }
});

app.post('/song', (req, res) => {
    const { userId } = req.body;
    const { name } = req.body;
    const { duration } = req.body;
    const { genre } = req.body;
    const { album } = req.body;
    const { releaseDate } = req.body;
    const { isMusician } = req.body;
    if (!flag) {
        if (isMusician == 1) {
        pool.query(`INSERT INTO ${'song'}(${'userId'}, ${'name'}, ${'duration'}, ${'genre'}, ${'album'}, ${'releaseDate'}) VALUES ('${userId}', '${name}', '${duration}', '${genre}', '${album}', '${releaseDate}')`, [], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: "Something went wrong"});
                } else {
                    console.log("Success");
                    return res.send(results);
                }
            });
        } else {
            return res.status(400).send({ error: "You can't add songs until you're musician"});
        }
    } else {
        const post = {
            userId: userId,
            name: name,
            duration: duration,
            genre: genre,
            album: album,
            releaseDate: releaseDate,
            isMusician: isMusician
        };
        db.collection("song").insertOne(post, (e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            return res.send(resp);
        });
    }
});

app.delete('/song', (req, res) => {
    const { songId } = req.query;
    if (!flag) {
        if (isMusician == 1) {
        pool.query(`DELETE FROM ${'song'} WHERE id = ${'songId'})`, [], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: "Something went wrong"});
                } else {
                    console.log("Success");
                    return res.send(results);
                }
            });
        } else {
            return res.status(400).send({ error: "You can't delete songs until you're musician"});
        }
    } else {
        db.collection("song").remove(
            { id: songId },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong"});
                return res.send(resp);
            }
        );
    }
});

app.get('/playlists', (req, res) => {
    if (!flag) {
        pool.query(`SELECT * FROM ${'playlist'}`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(404).send({ error: 'No songs found'});
            }
        });
    } else {
        db.collection("playlist").find().toArray((e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong"});
            return res.send(resp);
        })
    }
});


 

app.get('/playlist', (req, res) => {
    const { playlistId } = req.query; 
    if (!flag) {
        pool.query(`SELECT ${'playlist.id'}, ${'song.id'}, ${'song.userId'}, ${'song.name'}, ${'song.duration'}, ${'song.genre'}, ${'song.album'}, ${'song.releaseDate'} 
            FROM ${'playlist'} JOIN ${'playlistSongs'} ON playlist.id = playlistSongs.playlistId JOIN song ON song.id = playlistSongs.songId WHERE playlist.id ='${playlistId}'`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(404).send({ error: 'No playlist found'});
            }
        });
    } else {
        db.collection("playlist").findOne(
            { id: playlistId },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong"});
                return res.send(resp);
            }
        );
    }
});

app.post('/playlist', (req, res) => {
    const { userId } = req.body;
    const { name } = req.body;
    const { creationDate } = req.body;
    if (!flag) {
        pool.query(`INSERT INTO ${'playlist'}(${'userId'}, ${'name'}, ${'creationDate'}) VALUES ('${userId}', '${name}', '${creationDate}')`, [], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: "Something went wrong"});
            } else {
                return res.send(results);
            }
        });
    } else {
        const post = {
            userId: userId,
            name: name,
            creationDate: creationDate
        };
        db.collection("playlist").insertOne(post, (e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            return res.send(resp);
        });
    }
});

app.put('/playlist', (req, res) => {
    const { playlistId } = req.query;
    const { name } = req.body;
    if (!flag) {
        pool.query(`UPDATE ${'playlist'} SET name = '${name}' WHERE id = '${playlistId}'`, [], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: "No such playlist"});
            } else {
                return res.send(results);
            }
        });
    } else {
        db.collection("playlist").update(
            { id: playlistId },
            { name: name },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong"});
                return res.send(resp);
            }
        );
    }
});


app.post('/playlist-add-song', (req, res) => {
    const { playlistId } = req.body;
    const { songId } = req.body;
    if (!flag) {
        pool.query(`INSERT INTO ${'playlistSongs'}(${'playlistId'}, ${'songId'}) VALUES ('${playlistId}', '${songId}')`, [], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: "Something went wrong"});
            } else {
                return res.send(results);
            }
        });
    } else {
        const post = {
            playlistId: playlistId,
            songId: songId
        };
        db.collection("playlistSongs").insertOne(post, (e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            return res.send(resp);
        });
    }
});

app.post('/review', (req, res) => {
    const { userId } = req.body;
    const { playlistId } = req.body;
    const { rating } = req.body;
    const { comment } = req.body;
    if (!flag) {
        pool.query(`INSERT INTO ${'review'}(${'userId'}, ${'playlistId'}, ${'rating'}, ${'comment'}) VALUES ('${userId}', '${playlistId}', '${rating}', '${comment}')`, [], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: "Something went wrong"});
            } else {
                console.log(results);
                return res.send(results);
            }
        });
    } else {
        const post = {
            userId: userId,
            playlistId: playlistId,
            rating: rating,
            comment: comment
        };
        db.collection("review").insertOne(post, (e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            return res.send(resp);
        });
    }
});

app.get('/best-review', (req, res) => {
    if(!flag) {
        pool.query(`SELECT DISTINCT ${'playlist.id'}, ${'playlist.name'} , ${'review.rating'}
        FROM ${'playlist'} INNER JOIN ${'review'} ON playlist.id = review.playlistId ORDER BY ${'review.rating'} DESC`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: "Something went wrong"});
            } else {
                console.log(results);
                return res.send(results);
            }
        })
    } else {

        const pipeline = [
            {
                "$lookup": {
                    "from": "review",
                    "localField": "id",
                    "foreignField": "playlistId",
                    "as": "r"
                }
            },
            {
                "$unwind": "$r"
            },
            {
                "$group": {
                    "_id": {"playlistId": "$r.playlistId"},
                    "playlistName": {"$last": "$name"},
                    "rating": {"$first": "$r.rating"},
                    "comment": {"$first": "$r.comment"}
                }
            },            
          ];

          const cursor = db.collection('playlist').aggregate(pipeline, (err, cursor) => {
            if (err) {
                handleError(res, err.message, "Failed to get post");
              } else {
                cursor.toArray((error, documents) => {
                  if (error) { return handleError(res, error.message, "Failed to get post"); }
                  console.log(documents)
                  res.status(200).send(documents);
                });
              }
          });
    }
});


app.put('/review', (req, res) => {
    const { userId } = req.query;
    const { playlistId } = req.query
    const { rating } = req.body;
    const { comment } = req.body;
    if (!flag) {
        pool.query(`UPDATE ${'review'} SET rating = '${rating}', comment = '${comment}' WHERE (userId = '${userId}' AND playlistId = '${playlistId}')`, [], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: "Something went wrong"});
            } else {
                return res.send(results);
            }
        });
    } else {
        db.collection("review").update(
            { id: reviewId },
            { rating: rating, comment: comment },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong"});
                return res.send(resp);
            }
        );
    }
});

app.get('/reviews', (req, res) => {
    if (!flag) {
        pool.query(`SELECT * FROM ${'review'}`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(404).send({ error: 'No review found'});
            }
        });
    } else {
        db.collection("review").find().toArray((e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong"});
            return res.send(resp);
        });
    }
});

app.get('/review', (req, res) => {
    const { playlistId } = req.query; 
    if (!flag) {
        pool.query(`SELECT ${'review.id'}, ${'review.userId'}, ${'review.playlistId'}, ${'review.rating'}, ${'review.comment'}, ${'user.username'} FROM ${'review'} JOIN ${'user'} ON review.userId = user.id WHERE playlistId = '${playlistId}'`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(404).send({ error: 'No review found'});
            }
        });
    } else {
        db.collection("review").findOne(
            { playlistId: playlistId },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong"});
                return res.send(resp);
            }
        );
    }
});

app.delete('/review', (req, res) => {
    const { reviewId } = req.query;
    if (!flag) {
        pool.query(`DELETE FROM ${'review'} WHERE id = ${'reviewId'})`, [], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: "Something went wrong"});
                } else {
                    console.log("Success");
                    return res.send(results);
                }
        });
    } else {
        db.collection("review").remove(
            { id: reviewId },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong"});
                return res.send(resp);
            }
        );
    }
});

app.get('/migrate', (req, res) => {
    migrate();
    res.send('Migration is done.');
});

function migrate() {
    db.collection("user").drop().catch(e => console.log(e));
    db.collection("playlist").drop().catch(e => console.log(e));
    db.collection("review").drop().catch(e => console.log(e));
    db.collection("role").drop().catch(e => console.log(e));
    db.collection("song").drop().catch(e => console.log(e));
    db.collection("playlistSongs").drop().catch(e => console.log(e));

    pool.query(`select * from ${'user'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("user").insertMany(results);
    });

    pool.query(`select * from ${'playlist'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("playlist").createIndex({creationDate : -1}, function(err, res) {
            console.log(res);
            // callback(res);
        });
        // db.collection("playlist").hideIndex("creationDate_-1");
        db.collection("playlist").insertMany(results);
    });

    pool.query(`select * from ${'review'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("review").insertMany(results);
    });

    pool.query(`select * from ${'role'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("role").insertMany(results);
    });

    pool.query(`select * from ${'song'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("song").createIndex({"$**": "text"}, function(err, res) {
            console.log(res);
            // callback(res);
        });
        db.collection("song").insertMany(results);
    });

    pool.query(`select * from ${'playlistSongs'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("playlistSongs").insertMany(results);
    });

    flag = true;
}