import { describe, it, before } from "node:test";
import assert from "node:assert/strict";

// NOTE - make sure to update body to reqbody

// import support modules
import { loadDatabase } from "../modules/loadDatabase.js";

let database = "./db_0a9_database.json";

describe("UPDATE Operations", async () => {
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

  let updatedPlaylistsTestOne = {
    playlist_1: [
      {
        song_1: {
          songId: "0b7d6ac63e2adb656cfc83cd",
          mp3: "0b7d6a_empire_state_amina_zulauf.mp3",
          songName: "Empire State",
          artistName: "Amina Zulauf",
          albumName: "You Beautiful Thing",
          genre: "Hip Hop / Rap",
          characteristics: {
            volume: 43.6729,
            energy: 82.876,
            rhythm: 12.3463,
            positivity: 19.9084,
          },
        },
      },
      {
        song_2: {
          songId: "ccc2d35d0add0a11dcd9dc7e",
          mp3: "ccc2d3_night_&_day_vince_koelpin.mp3",
          songName: "Night & Day",
          artistName: "Vince Koelpin",
          albumName: "Weak",
          genre: "Hip Hop / Rap",
          characteristics: {
            volume: 63.7539,
            energy: 73.2617,
            rhythm: 97.1621,
            positivity: 49.8698,
          },
        },
      },
      {
        song_3: {
          songId: "cffa8ac9fdfd1ed843fdfa55",
          mp3: "cffa8a_vaya_con_dios_(may_god_be_with_you)_coralie_stanton.mp3",
          songName: "Vaya Con Dios (may God Be With You)",
          artistName: "Coralie Stanton",
          albumName: "Love In This Club",
          genre: "Indie",
          characteristics: {
            volume: 33.4706,
            energy: 35.1922,
            rhythm: 97.7912,
            positivity: 46.2433,
          },
        },
      },
      {
        song_4: {
          songId: "c5ae5eda3fcdbb5dcaddc966",
          mp3: "c5ae5e_airplanes_mandy_lehner.mp3",
          songName: "Airplanes",
          artistName: "Mandy Lehner",
          albumName: "Brother",
          genre: "Country",
          characteristics: {
            volume: 40.0582,
            energy: 28.9597,
            rhythm: 72.6665,
            positivity: 36.1838,
          },
        },
      },
      {
        song_5: {
          songId: "ccde3e48dbcf1d7d5174bdf0",
          mp3: "ccde3e_love_to_love_you_baby_shyanne_leannon.mp3",
          songName: "Love to Love You Baby",
          artistName: "Shyanne Leannon",
          albumName: "The Thing",
          genre: "Jazz",
          characteristics: {
            volume: 37.5301,
            energy: 23.0473,
            rhythm: 98.5819,
            positivity: 62.3314,
          },
        },
      },
    ],
  };

  // PUT /api/account endpoint, success case
  describe("Successfully update an account provided with a userId address", async () => {
    before(async () => {
      // Update Peter Parker's account
      userId = "8c6efe348c3d5a2d2aef1acc";
      url = `http://localhost:3000/api/user/${userId}`;

      reqBody = {
        password: "spidey-123",
        firstName: "Peter",
        lastName: "Parker",
        fullName: "Peter Parker",
        email: "Peter71@yahoo.com",
      };

      response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      body = await response.json();
    });

    it("API returns correct 200 status code after successfully updating an account's information", async () => {
      assert.strictEqual(response.status, 200);
    });

    it("API returns correct response body after successfully updating an account's information", async () => {
      let message = body["message"];
      let updatedAccount = body["updatedAccount"];

      let correctUpdatedAccount = {
        id: "8c6efe348c3d5a2d2aef1acc",
        password: "spidey-123",
        firstName: "Peter",
        lastName: "Parker",
        fullName: "Peter Parker",
        email: "Peter71@yahoo.com",
        playlists: updatedPlaylistsTestOne,
      };

      assert.strictEqual(message, "Successfully updated account!");
      //   console.log(body);
      assert.deepEqual(body, {
        message: "Successfully updated account!",
        updatedAccount: correctUpdatedAccount,
      });
    });
  });

  // PUT /api/account endpoint, error case
  describe("Send correct response back when given user ID not in the db", async () => {
    before(async () => {
      // Update Peter Parker's account
      userId = "abcdefghijkl122333445678";
      url = `http://localhost:3000/api/user/${userId}`;

      reqBody = {
        password: "spidey-123",
        firstName: "Peter",
        lastName: "Parker",
        fullName: "Peter Parker",
        email: "Peter71@yahoo.com",
      };

      response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      body = await response.json();
    });

    it("API returns correct 200 status code after successfully updating an account's information", async () => {
      assert.strictEqual(response.status, 404);
    });

    it("API returns correct message after not finding the user ID of account to update in the database", async () => {
      let error = body["error"];
      assert.strictEqual(error, "User is not in database");
      assert.deepEqual(body, { error: "User is not in database" });
    });
  });

  // PUT /api/account endpoint, success case
  describe("Successfully update a playlist that an account has", async () => {
    // Putting playlist_1 here to make this variable accessible in
    // both the before function and the it() function
    // with test name "API successfully updates a playlist given 
    // a valid account ID and playlist"
    let playlist_1 = [
      {
        song_1: {
          songId: "0b7d6ac63e2adb656cfc83cd",
          mp3: "0b7d6a_empire_state_amina_zulauf.mp3",
          songName: "Empire State",
          artistName: "Amina Zulauf",
          albumName: "You Beautiful Thing",
          genre: "Hip Hop / Rap",
          characteristics: {
            volume: 43.6729,
            energy: 82.876,
            rhythm: 12.3463,
            positivity: 19.9084,
          },
        },
      },
      {
        song_2: {
          songId: "ccc2d35d0add0a11dcd9dc7e",
          mp3: "ccc2d3_night_&_day_vince_koelpin.mp3",
          songName: "Night & Day",
          artistName: "Vince Koelpin",
          albumName: "Weak",
          genre: "Hip Hop / Rap",
          characteristics: {
            volume: 63.7539,
            energy: 73.2617,
            rhythm: 97.1621,
            positivity: 49.8698,
          },
        },
      },
      {
        song_3: {
          songId: "cffa8ac9fdfd1ed843fdfa55",
          mp3: "cffa8a_vaya_con_dios_(may_god_be_with_you)_coralie_stanton.mp3",
          songName: "Vaya Con Dios (may God Be With You)",
          artistName: "Coralie Stanton",
          albumName: "Love In This Club",
          genre: "Indie",
          characteristics: {
            volume: 33.4706,
            energy: 35.1922,
            rhythm: 97.7912,
            positivity: 46.2433,
          },
        },
      },
      {
        song_4: {
          songId: "c5ae5eda3fcdbb5dcaddc966",
          mp3: "c5ae5e_airplanes_mandy_lehner.mp3",
          songName: "Airplanes",
          artistName: "Mandy Lehner",
          albumName: "Brother",
          genre: "Country",
          characteristics: {
            volume: 40.0582,
            energy: 28.9597,
            rhythm: 72.6665,
            positivity: 36.1838,
          },
        },
      },
      {
        song_5: {
          songId: "ccde3e48dbcf1d7d5174bdf0",
          mp3: "ccde3e_love_to_love_you_baby_shyanne_leannon.mp3",
          songName: "Love to Love You Baby",
          artistName: "Shyanne Leannon",
          albumName: "The Thing",
          genre: "Jazz",
          characteristics: {
            volume: 37.5301,
            energy: 23.0473,
            rhythm: 98.5819,
            positivity: 62.3314,
          },
        },
      },
      {
        song_6: {
          songId: "ccc2d35d0add0a11dcd9dc7e",
          mp3: "ccc2d3_night_&_day_vince_koelpin.mp3",
          songName: "Night & Day",
          artistName: "Vince Koelpin",
          albumName: "Weak",
          genre: "Hip Hop / Rap",
          characteristics: {
            volume: 63.7539,
            energy: 73.2617,
            rhythm: 97.1621,
            positivity: 49.8698,
          },
        },
      },
      {
        song_7: {
          songId: "cffa8ac9fdfd1ed843fdfa55",
          mp3: "cffa8a_vaya_con_dios_(may_god_be_with_you)_coralie_stanton.mp3",
          songName: "Vaya Con Dios (may God Be With You)",
          artistName: "Coralie Stanton",
          albumName: "Love In This Club",
          genre: "Indie",
          characteristics: {
            volume: 33.4706,
            energy: 35.1922,
            rhythm: 97.7912,
            positivity: 46.2433,
          },
        },
      },
    ];

    before(async () => {
      // Update Peter Parker's account
      userId = "8c6efe348c3d5a2d2aef1acc";
      playlistName = "playlist_1";
      /** Adding two songs to Peter Parker's playlist:
       * 1) Adding song "Night & Day" by Vince Koelpin, and
       * 2) Adding song "Vaya Con Dios (may God Be With You)"
       * by Coralie Stanton
       * */

      reqBody = { playlist_1 };

      url = `http://localhost:3000/api/user/${userId}/playlists/${playlistName}`;

      response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      body = await response.json();

      db = await loadDatabase(database);
    });

    it("API returns correct 200 status code after successfully updating an account playlist", async () => {
    //   console.log(body);
      assert.strictEqual(response.status, 200);
    });

    it("API successfully updates a playlist given a valid account ID and playlist", async () => {
      let message = "Successfully updated playlist!";
      let updatedPlaylist = { playlist_1: playlist_1 };
      let correctResponse = {};
      correctResponse["message"] = message;
      correctResponse["updatedPlaylist"] = {};
      correctResponse["updatedPlaylist"] = updatedPlaylist;

      assert.strictEqual(message, `Successfully updated playlist!`);
      assert.deepEqual(body, correctResponse);
    });
  });

  // PUT /api/account endpoint, error case
  describe("Send correct response back when given a playlist to update that an account does not have", async () => {
    before(async () => {
      // Update Peter Parker's account
      userId = "8c6efe348c3d5a2d2aef1acc";
      playlistName = "playlist_5";
      reqBody = {
        playlist_5: [
          {
            song_1: {
              songId: "0b7d6ac63e2adb656cfc83cd",
              mp3: "0b7d6a_empire_state_amina_zulauf.mp3",
              songName: "Empire State",
              artistName: "Amina Zulauf",
              albumName: "You Beautiful Thing",
              genre: "Hip Hop / Rap",
              characteristics: {
                volume: 43.6729,
                energy: 82.876,
                rhythm: 12.3463,
                positivity: 19.9084,
              },
            },
          },
        ],
      };

      url = `http://localhost:3000/api/user/${userId}/playlists/${playlistName}`;

      reqBody = {
        password: "spidey-123",
        firstName: "Peter",
        lastName: "Parker",
        fullName: "Peter Parker",
        email: "Peter71@yahoo.com",
      };

      response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      body = await response.json();
    });

    it("API returns correct 404 status code after not finding fake playlist in user's account", async () => {
      assert.strictEqual(response.status, 404);
    });

    it("API returns correct message after not finding fake playlist in user's account", async () => {
      let error = body["error"];
      assert.strictEqual(error, "Playlist not found");
      assert.deepEqual(body, { error: "Playlist not found" });
    });
  });
});
