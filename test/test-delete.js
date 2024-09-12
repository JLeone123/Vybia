import { describe, it, before } from "node:test";
import assert from "node:assert/strict";

// // import support modules
import { loadDatabase } from "../modules/loadDatabase.js";

let database = "./db_0a9_database.json";

describe("DELETE Operations", async () => {
    // database variables
    let db;
    let originalDbLength;
    let newDbLength;
    
    // account variables
    let userId;
    let playlistName;

    // http endpoint and response variables
    let url;
    let response;
    let body;

    // DELETE /api/user/:userId endpoint, success case
    describe("API deletes account successfully given an ID and responds with correct 200 status and message", async () => {
        before (async () => {
            db = await loadDatabase(database);
            originalDbLength = Object.keys(db).length;

            userId = "c7d1a7d167c990cddd6449ad";

            url = `http://localhost:3000/api/user/${userId}`;

            response = await fetch(url, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            body = await response.json();
        });

        await it("API returns correct 200 status code after deleting account successfully", async () => {
            assert.strictEqual(response.status, 200);
        });

        await it("API responds with correct message after deleteing account successfully", async () => {
            assert.strictEqual(body['message'], 
            "Successfully deleted account!  Orbitus is sad to see you go.  Please feel free to stream on our platform anytime!");
        });

        await it("API correctly updates the database after successfully deleting an account", async () => {
            db = await loadDatabase(database);
            newDbLength = Object.keys(db).length;
            assert.equal(originalDbLength - 1, newDbLength);
        });
    });

    // DELETE /api/user/:userId endpoint, error case
    describe("API returns correct 404 status code and response message when asked to delete an account not in the database", async () => {
        before (async () => {
            userId = "c7d1a7d167c990cddd6449ad";
            db = await loadDatabase(database);
            originalDbLength = Object.keys(db).length;

            url = `http://localhost:3000/api/user/${userId}`;

            response = await fetch(url, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            body = await response.json();
        });

        await it("API returns correct 404 status code when requested to delete an account not in the database", async () => {
            assert.equal(response.status, 404);
        });

        await it("API responds with the correct error message when requested to delete an account not in the database", async () => {
            assert.equal(body['error'], "Account not found!");
        });
    });

    // /api/user/:userId/playlists/:playlistName, success case
    describe("API successfully deletes playlist from a user's account", async () => {
        before (async () => {
            userId = "58c7b9dfd8af34cebc6fbddb";
            playlistName = "playlist_1";

            url = `http://localhost:3000/api/user/${userId}/playlists/${playlistName}`;

            response = await fetch(url, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            body = await response.json();
        });

        await it("API returns correct 200 status code when requested to delete a user's playlist", async () => {
            assert.equal(response.status, 200);
        });

        await it("API returns correct response message after deleting a user's playlist", async () => {
            assert.equal(body['message'], "Successfully deleted playlist!");
        });

        await it("API correctly updates the database after deleting a user's playlist", async () => {
            db = await loadDatabase(database);

            let foundAccount = Object.entries(db).find(a => {
                if (a[1]['id'] === userId) {
                    return a;
                }
            });

            let accountPlaylists = foundAccount[1]['playlists'];
            assert.equal("playlist_1" in accountPlaylists, false);
        });
    });

    // /api/user/:userId/playlists/:playlistName, error case
    describe("API returns correct 404 response when sent a request to delete a playlist that a user does not have", async () => {
        before (async () => {
            let userId = "8c6efe348c3d5a2d2aef1acc";
            let playlistName = "playlist_2";

            url = `http://localhost:3000/api/user/${userId}/playlists/${playlistName}`;

            response = await fetch(url, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            body = await response.json();
        });

        await it("API returns 404 response code when given an empty ID string", async () => {
            assert.equal(response.status, 404);
        });

        await it("API returns correct error message when given an empty ID string", async () => {
            assert.equal(body['error'], "Playlist not found!");
        });
    });
});