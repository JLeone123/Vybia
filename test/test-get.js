import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { loadDatabase } from "../modules/loadDatabase.js";

// Need to run the test suites in the route directory
/**** Tests for each GET Operation ****/
describe("GET Operations", async () => {
    // account variables
    let accountId;
    let accountEmail;
    let playlistName;

    // song variables
    let songId;

    // http endpoint and response variables
    let url;
    let response;
    let body;

    // GET /api/account/:userId/:accountEmail endpoint, success case
    describe("Read in a user account provided a user ID and an email address successfully", async () => {
        before (async () => {
            accountId = "8c6efe348c3d5a2d2aef1acc";
            accountEmail = "Peter71@yahoo.com";
            url = `http://localhost:3000/api/account/${accountId}/${accountEmail}`;
            response = await fetch(url);
            body = await response.json();
        });

        await it('API responds with a status code of 200', async () => {
            assert.equal(response.status, 200);
        });

        await it ('API responds with the correct response body for the first account, person_1', async () => {
            /**** Test contents of response body ***/
            // Test if the response body has the correct properties
            assert.equal(Object.keys(body).length, 2);
            assert.equal(Object(body).hasOwnProperty('message'), true);
            assert.equal(Object(body).hasOwnProperty('account'), true);
            assert.strictEqual(typeof body['account'][1]['playlists'], "object");
            
            assert.equal(Object.values(body['account'][1]['playlists']).length, 1);

            // Test if the content of the response body matches the expected output
            assert.strictEqual(body['message'], "Successfully found account!");
            assert.strictEqual(body['account'][0], 'person_1');
            assert.strictEqual(body['account'][1]['id'], '8c6efe348c3d5a2d2aef1acc');
            assert.strictEqual(body['account'][1]['password'], '7sTu');
            assert.strictEqual(body['account'][1]['firstName'], 'Peter');
            assert.strictEqual(body['account'][1]['lastName'], 'Parker');
            assert.strictEqual(body['account'][1]['fullName'], 'Peter Parker');
            assert.strictEqual(body['account'][1]['email'], 'Peter71@yahoo.com');
        });
    });

    // GET /api/account/:userId/:accountEmail endpoint, error case
    // Give an invalid account ID and an invalid email
    describe("API sends 404 status and correct error when account ID and email are not found", async () => {
        before (async () => {
            accountId = "abc1def2ghi3jkl4mnop5qrs6";
            accountEmail = "johndoe123@anonymous.com";
            url = `http://localhost:3000/api/account/${accountId}/${accountEmail}`;
            response = await fetch(url);
            body = await response.json();
        });

        await it("API responds with correct status code of 404 given ID, email not in database", async () => {
            assert.equal(response.status, 404);
        });

        await it("API responds with correct HTTP response body when sent ID, email not in database", async () => {
            assert.equal(body['message'], "Account does not exist");
        });
    });

    // GET /api/user/:userId/playlists/:playlistName endpoint, success case
    describe("API sends 200 status and correct response message when given playlist name associated with an account", async () => {
        before(async () => {
            accountId = "8c6efe348c3d5a2d2aef1acc";
            playlistName = "playlist_1";
            url = `http://localhost:3000/api/user/${accountId}/playlists/${playlistName}`;
            response = await fetch(url);
            body = await response.json();
        });

        await it("API sends 200 status code when given an account ID and playlist that account has", async () => {
            assert.strictEqual(response.status, 200);
        });

        await it ("API sends correct playlist when given an account ID and playlist", async () => {
            assert.strictEqual(Array.isArray(body), true);
            assert.strictEqual(body.length, 5);

            body.forEach((s, i) => {
                assert.equal(typeof s[`song_${i+1}`], "object");
                assert.equal(Object.keys(s[`song_${i+1}`]).length, 7);
            });

            // Test contents of one song - in this case song_1 from Peter Parker's playlist
            let songOne = body[0]['song_1'];

            assert.equal(songOne['songId'], "0b7d6ac63e2adb656cfc83cd");
            assert.equal(songOne['mp3'], "0b7d6a_empire_state_amina_zulauf.mp3");
            assert.equal(songOne['artistName'], "Amina Zulauf");
            assert.equal(songOne['albumName'], "You Beautiful Thing");
            assert.equal(songOne['genre'], "Hip Hop / Rap");
            assert.equal(typeof songOne['characteristics'], "object");
            assert.equal(songOne['characteristics']['volume'], 43.6729);
            assert.equal(songOne['characteristics']['energy'], 82.876);
            assert.equal(songOne['characteristics']['rhythm'], 12.3463);
            assert.equal(songOne['characteristics']['positivity'], 19.9084);
        });
    });

    // GET /api/user/:userId/playlists/:playlistName endpoint, error case
    describe("API sends 404 status and error message given an account ID and playlist that account does not have", async () => {
        before(async () => {
            accountId = "8c6efe348c3d5a2d2aef1acc";
            playlistName = "tropical_ocean_vibes";
            url = `http://localhost:3000/api/user/${accountId}/playlists/${playlistName}`;
            response = await fetch(url);
            body = await response.json();
        });

        await it("API sends 404 status when given an account ID and playlist that account does not have", async () => {
            assert.strictEqual(response.status, 404);
        });

        await it("API sends correct error message when given an account ID and playlist that account does not have", async () => {
            assert.strictEqual(body['error'], "Playlist not found");
        });
    });

    // GET /api/song/:songId endpoint, success case
    describe("API returns 200 status and correct song entity given a song ID from song database", async () => {
        before(async () => {
            songId = "e948ef95fefa4a61d4250dda";
            url = `http://localhost:3000/api/song/${songId}`;
            response = await fetch(url);
            body = await response.json();
        });

        await it("API sends 200 status when song entity is found from the song database with given song's ID", async () => {
            assert.strictEqual(response.status, 200);
        });

        await it("API sends correct response message when song entity is found from the song database given song's ID", async () => {
            assert.strictEqual(body['message'], "Successfully found song!");
           
            let song = body['song'];
            let songCharacteristics = song['characteristics'];

            assert.strictEqual(typeof song, "object");
            assert.strictEqual(song['songId'], "e948ef95fefa4a61d4250dda");
            assert.strictEqual(song['mp3'], "e948ef_maneater_bernard_steuber.mp3");
            assert.strictEqual(song['songName'], "Maneater");
            assert.strictEqual(song['artistName'], "Bernard Steuber");
            assert.strictEqual(song['albumName'], "In the End");
            assert.strictEqual(song['genre'], "Jazz");
            assert.strictEqual(typeof songCharacteristics, "object");
            assert.strictEqual(songCharacteristics['volume'], 67.9522);
            assert.strictEqual(songCharacteristics['energy'], 5.2401);
            assert.strictEqual(songCharacteristics['rhythm'], 81.4605);
            assert.strictEqual(songCharacteristics['positivity'], 95.8176);
        });
    });

    // GET /api/song/:songId endpoint, error case
    describe("API returns 404 status and correct error message given a song ID not in the song database", async () => {
        before(async () => {
            songId = "abcdefghijklmnopqrstuvwx";
            url = `http://localhost:3000/api/song/${songId}`;
            response = await fetch(url);
            body = await response.json();
        });

        it("API sends correct 404 status when given song ID not in database", async () => {
            assert.strictEqual(response.status, 404);
        });

        it ("API sends correct error message when given song ID not in database", async () => {
            assert.strictEqual(body['error'], "Song not found!");
        });
    });

    // GET /api/songs/modes/joyride, success case
    describe("API returns 200 status and playlist generated by 'Joyride Mode'", async () => {
        before (async () => {
            url = 'http://localhost:3000/api/songs/modes/joyride';
            response = await fetch(url);
            body = await response.json();
        });

        await it("API sends correct 200 status when returned playlist by 'Joyride Mode'", async () => {
            assert.strictEqual(response.status, 200);
        });

        await it("API returns correct list of songs matching the criteria for a 'Joyride Mode' playlist requested from the songs database", async () => {
            assert.strictEqual(body['message'], 'Joyride Mode');
            assert.strictEqual(Array.isArray(body['playlist']), true);

            // The criteria for a song to be in a 'Joyride Mode' generated playlist is
            // that its volume, energy, and rhythm are greater than or equal to a score 
            // of 75.0, and its positivity is greater than or equal to a score of 50.0
            Object.entries(body['playlist']).forEach(s => {
                let characteristics = s[1]['characteristics'];
                let volume = characteristics['volume'];
                let energy = characteristics['energy'];
                let rhythm = characteristics['rhythm'];
                let positivity = characteristics['positivity'];

                assert.equal(volume >= 75, true);
                assert.equal(energy >= 75, true);
                assert.equal(rhythm >= 75, true);
                assert.equal(positivity >= 50, true);
            });
        });
    });

    // GET /api/songs/modes/on-a-mission, success case
    describe("API returns 200 status and playlist generated by 'Cruisin' Mode'", async () => {
        before (async () => {
            url = 'http://localhost:3000/api/songs/modes/cruisin';
            response = await fetch(url);
            body = await response.json();
        });

        await it("API sends correct 200 status when returned playlist by 'Cruisin' Mode'", async () => {
            assert.strictEqual(response.status, 200);
        });

        await it("API returns correct list of songs matching the criteria for a 'Cruisin' Mode' playlist requested from the songs database", async () => {
            assert.strictEqual(body['message'], "Cruisin' Mode");
            assert.strictEqual(Array.isArray(body['playlist']), true);

            // The criteria for a song to be in a 'Cruisin' Mode' generated playlist is
            // that its volume and energy scores are less than or equal to 75.0
            // and its rhythm is less than or equal to a score of 50.0
            Object.entries(body['playlist']).forEach(s => {
                let characteristics = s[1]['characteristics'];
                let volume = characteristics['volume'];
                let energy = characteristics['energy'];
                let rhythm = characteristics['rhythm'];

                assert.equal(volume <= 75, true);
                assert.equal(energy <= 75, true);
                assert.equal(rhythm <= 50, true);
            });
        });
    });

    // GET /api/songs/modes/on-a-mission, success case
    describe("API returns 200 status and playlist generated by 'On A Mission Mode'", async () => {
        before (async () => {
            url = 'http://localhost:3000/api/songs/modes/on-a-mission';
            response = await fetch(url);
            body = await response.json();
        });

        await it("API sends correct 200 status when returned playlist by 'Cruisin' Mode'", async () => {
            assert.strictEqual(response.status, 200);
        });

        await it("API returns correct list of songs matching the criteria for a 'On A Mission Mode' playlist requested from the songs database", async () => {
            assert.strictEqual(body['message'], "On A Mission Mode");
            assert.strictEqual(Array.isArray(body['playlist']), true);

            // The criteria for a song to be in a 'Cruisin' Mode' generated playlist is
            // that its volume, energy, and rhythm are less than a score of 30.0
            Object.entries(body['playlist']).forEach(s => {
                let characteristics = s[1]['characteristics'];
                let volume = characteristics['volume'];
                let energy = characteristics['energy'];
                let rhythm = characteristics['rhythm'];

                assert.equal(volume <= 30, true);
                assert.equal(energy <= 30, true);
                assert.equal(rhythm <= 30, true);
            });
        });
    });

});