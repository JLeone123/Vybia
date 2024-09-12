import { describe, it, before } from "node:test";
import assert from "node:assert/strict";

// NOTE - make sure to update body to reqbody

// import support modules
import { loadDatabase } from "../modules/loadDatabase.js";

let database = "./db_0a9_database.json";

describe("CREATE Operations", async () => {
    // database variables
    let db;
    let originalDbLength;
    let newDbLength;

    // account variables
    let firstName;
    let lastName;
    let email;
    
    let userId;
    let name;
    let playlist;
    let playlistName;
    // song variables
    let songId;

    // http endpoint and response variables
    let url;
    let reqBody;
    let response;
    let body;

    // POST /api/account endpoint, success case
    describe("Create a new account provided with a userId address successfully", async () => {
        before (async () => {
            firstName = "John";
            lastName = "Doe";
            email = "jdoe@zmail.com";
            db = await loadDatabase(database);
            // console.log("create tests:");
            // console.log(db);
            originalDbLength = Object.keys(db).length;
            reqBody = {
                account: {
                    firstName,
                    lastName,
                    email,
                }
            }

            url = "http://localhost:3000/api/account";

            response = await fetch(url, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(reqBody),
            });

            body = await response.json();
            db = await loadDatabase(database);
            newDbLength = Object.keys(db).length;
        });

        it("API returns correct 201 status code after creating a new account", async () => {
            assert.strictEqual(response.status, 201);
        });

        it("API returns correct response message after creating a new account", async() => {
            // test if the message field is the correct response
            assert.equal(body['message'], "Successfully created a new account!");
            
            // test to see if the new account ID 24 characters long
            assert.equal(body['id'].length, 24);

            // test to see if the temporary password is between 4 and 17 characters inclusive
            assert.equal(body['password'].length >= 3, true);
            assert.equal(body['password'].length <= 17, true);
        });

        it("API correctly updates the database after creating a new account", async () => {
            assert.equal(newDbLength, originalDbLength + 1);

            let newAccount = db[`person_${newDbLength}`];

            assert.equal(newAccount['id'].length, 24);

            assert.equal(newAccount['password'].length >= 3, true);
            assert.equal(newAccount['password'].length <= 17, true);

            assert.equal(newAccount['firstName'], "John");
            assert.equal(newAccount['lastName'], "Doe");
            assert.equal(newAccount['fullName'], "John Doe");
            assert.equal(newAccount['email'], "jdoe@zmail.com");
            assert.equal(typeof newAccount['playlists'], "object");
            assert.equal(Object.keys(newAccount['playlists']).length, 0);
        });
    });

    // POST /api/account endpoint, error case
    describe("API returns correct 400 status code and message if account already exists with the same first and last names and email address", async () => {
        before (async () => {
            firstName = "John";
            lastName = "Doe";
            email = "jdoe@zmail.com";
            db = await loadDatabase(database);
            originalDbLength = Object.keys(db).length;
            reqBody = {
                account: {
                    firstName,
                    lastName,
                    email,
                }
            }

            url = "http://localhost:3000/api/account";

            response = await fetch(url, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(reqBody),
            });

            body = await response.json();
        });

        it('API responds with a status code of 400 when requested to create an account that already exists with the same first and last names, and email address', async () => {
            assert.equal(response.status, 400);
        });

        it('API responds with correct error message when requested to create an account that already exists with the same first and last names, and email address', async () => {
            assert.equal(body['message'], "Account already exists with this name and email address");
        });
    });

    // POST /api/user/:userId/addPlaylist endpoint, success case
    describe("Add a new playlist to an account successfully", async () => {
        before (async () => {
            userId = "c7d1a7d167c990cddd6449ad";
            playlistName = "test playlist 1";
            name = "James Leone";

            playlist = [
                {
                    "song_1": {
                        "songId": "48dab6c080fed23cb4dab91e",
                        "mp3": "48dab6_surfin'_usa_miracle_beer.mp3",
                        "songName": "Surfin' USA",
                        "artistName": "Surfer Bro",
                        "albumName": "Superstar",
                        "genre": "Punk",
                        "characteristics": {
                            "volume": 30.9638,
                            "energy": 75.2002,
                            "rhythm": 20.8039,
                            "positivity": 39.2557
                        }
                    }
                }
            ];

            reqBody = {
                name: playlistName,
                playlist: playlist,
            }

            url = `http://localhost:3000/api/user/${userId}/addPlaylist`;

            response = await fetch(url, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(reqBody),
            });

            body = await response.json();
        });

        it("API returns 201 status code after successfully adding a playlist to a user's list of playlists", async() => {  
            assert.equal(response.status, 201);
        });

        it("API returns correct response message after successfully adding a playlist to a user's list of playlists", async() => {
            let playlists = {};
            playlists[`${playlistName}`] = playlist;
            assert.strictEqual(body['message'], "Successfully added playlist");
            assert.deepEqual(body['playlists'], playlists);
        });

        it("API correctly updates user playlists in the database after successfully adding a playlist", async () => {
            db = await loadDatabase(database);
            let newPlaylist = db['person_11']['playlists']['test playlist 1'];
            assert.deepEqual(newPlaylist, playlist);
        });
    });

    // POST /api/user/:userId/playlists/:playlist endpoint, error case
    describe("API correctly handles a request to add a playlist to a user account with invalid input", async () => {
        before (async () => {
            userId = "c7d1a7d167c990cddd6449ad";
            playlistName = "test playlist with length zero";
            name = "James Leone";
            playlist = []; // empty array
            reqBody = {
                name: playlistName,
                playlist: playlist,
            }

            url = `http://localhost:3000/api/user/${userId}/addPlaylist`;

            response = await fetch(url, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(reqBody),
            });

            body = await response.json();
        });

        await it('API responds with a status code of 400 after requested to add a playlist with invalid parameters', async () => {
            assert.equal(response.status, 400);
        });

        await it('API responds with correct error message after requested to add a playlist with invalid parameters', async () => {
            assert.equal(body['error'], "Either the user ID, playlist length, name, or combination of them is empty!");
        });
    });
});