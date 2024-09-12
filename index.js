// import Express library
import express from "express";

// import Node middleware libraries / modules
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import responseTime from "response-time";
import requestIp from "request-ip";
import { faker } from "@faker-js/faker";

// import Node support modules
import process from "node:process";
import { writeFile } from "fs/promises";
import { unlinkSync } from "fs";

// import modules
import { createDatabase } from "./modules/createDatabase.js";
import { createSongDatabase } from "./modules/createSongDatabase.js";
import { loadDatabase } from "./modules/loadDatabase.js";
import { loadSongDatabase } from "./modules/loadSongDatabase.js";
import { logger } from "./modules/logger.js";

// I originally generated fake, random data if the database files 
// did not exist or read from them if they did exist.
// However, to create reliable tests, I realized that this would not work.
// To fix this, I generated a lot of fake data that is written to two database files as JSON
// from object data structures each time that the API process begins.  To ensure that these 
// databases are in-memory, the two file databases will be unlinked when the process exits.
// If the data should be randomized completely, the two functions createData()
// and createSongDb() can be called to generate completely randomized in-memory
// database JSON files.
// import { createData, createSongDb } from "./createData.js";

const database = "./db_0a9_database.json";
const songDatabase = "./sdb_0b7_make_song_database.json";

/**** 🚀 Project setup 🚀 ****/

// defining a middleware related to my API called setRequestStatistics
// which provides in the body of the HTTP request statistics related to the API call,
// such as a (requestTime) timestamp, the route that the request is sent to,
// the request method, and the client device's IP address, which could be useful to know
// for security reasons, such as blacklisting the IP address if the user abuses the API.
const setRequestStatistics = async (req, res, next) => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  let requestTime = `${month}/${day}/${year} at ${hours}:${minutes}:${seconds}`;

  req.body["requestStats"] = {
    requestTime: requestTime,
    route: req.originalUrl,
    method: req.method,
    clientIp: req.clientIp,
  };

  // Logs request information to the console and will also
  // be logged to the requestInfo logs using Winston.
  console.log(req.body['requestStats']);
  
  next();
};

// Create an Express app and set the server port number
const app = express();
const port = process.env.PORT || 3000;

// Help secure the Express application by setting HTTP response headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (resolves Access-Control-Allow-Origin issue iirc)
app.use(cors());

// Return middleware that only parses JSON and only looks at requests
// where the Content-Type header matches the type option
app.use(express.json());

// log incoming HTTP requests with Morgan
app.use(morgan("dev"));

// Use express-rate-limiter to prevent excessive requests from a client / consumer,
// which will improve response time and prevent performance bottlenecks.
// In this case, the express-rate-limiter middleware will limit users to
// send more than ten requests in a minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// Adding another rate limiter to prevent brute force attacks.
// All requests made after the threshold should be able
// to be handled by the API.
const bruteForceLimiter = rateLimit({
  windowMs: 50,
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// use the express-rate-limiter here
// app.use(limiter);
app.use(bruteForceLimiter);

// Get request statistics including the ip address of a user
app.use(requestIp.mw());
app.use(setRequestStatistics);

// Use response-time middleware to record the response time 
// for HTTP server requests
app.use(responseTime());

// Prettify the JSON responses
app.set("json spaces", 4);

// destroy databases on shutdown.
const gracefullyRemoveDatabases = () => {
    unlinkSync(`${database}`);
    unlinkSync(`${songDatabase}`);
    process.exit(0);
}

process.on('SIGHUP', gracefullyRemoveDatabases);
process.on('SIGINT', gracefullyRemoveDatabases);

await createSongDatabase(songDatabase);
await createDatabase(database);

/**** Create Operations ****/
// Create a new account
app.post("/api/account", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "POST", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);
  let { account } = req.body;
  let firstName = account['firstName'];
  let lastName = account['lastName'];

  // Set up account email to be stored in the database
  let email = account['email'];

  if (!account || !firstName || !lastName || !email) {
    logger.error("Invalid account information");
    res.status(400).send({ error: "Invalid account information" });
    return;
  }

  if (typeof account !== "object" || typeof firstName !== "string" 
      || typeof lastName !== "string" || typeof email !== "string") {
      logger.error("To make an account, please provide account information as strings");
      res.status(400).send({ error: "To make an account, please provide account information as strings" });
      return;
  }

  if (firstName.length === 0 || lastName.length === 0 || email.length === 0) {
    logger.error("Account information is an empty string!");
    res.status(400).send({ error: "Account information is an empty string!"});
    return;
  }

  let db = await loadDatabase(database);

  if (db === undefined) {
    logger.error("Cannot get the database right now");
    res.status(500).send({ error: "Cannot get the database right now"});
    return;
  }

  let alreadyExistingAccount = Object.entries(db).find(a => {
    if (a[1]['firstName'] === firstName && a[1]['lastName'] && a[1]['email'] === email) {
      return a;
    }
  });

  if (alreadyExistingAccount) {
    res.status(400).send({ message: "Account already exists with this name and email address" });
    return;
  }

  let numberOfAccounts = Object.keys(db).length;

  // Set up unique id of the account to be
  // stored in the database
  let id = faker.database.mongodbObjectId();

  // Set up password of the account to be
  // stored in the database
  let password = faker.internet.password({
    length: Math.floor(Math.random() * (17 - 4) + 4),
  });

  // Set up full name of the account to be
  // stored in the database
  let fullName = `${firstName} ${lastName}`;

  // The user does not and cannot create playlists before
  // his / her account is created, so an empty object
  // will suffice for the playlists property
  let newAccountName = `person_${numberOfAccounts + 1}`;

  let newAccount = { id, password, firstName, lastName, fullName, email, playlists: {}};

  db[newAccountName] = newAccount;

  let writeOperation = await writeFile(database, JSON.stringify(db, null, 4), "utf-8");

  if (writeOperation !== undefined) {
    logger.error("Cannot update the database right now");
    res.status(500).send({ error: "Cannot update the database right now"});
    return;
  }

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "POST", message: "response"`);
  logger.info("Successfully created a new account!");
  res.status(201).send({ message: "Successfully created a new account!", id, password });
});

// Add a playlist to a user's account, specified in the request body
app.post("/api/user/:userId/addPlaylist", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "POST", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);
  // playlist will have a name, and any amount of songs
  let userId = req.params["userId"];
  let playlist = req.body["playlist"];
  let name = req.body["name"];
  
  if (!userId || !playlist || !name) {
    logger.error("To create a playlist, you must have an account and have a non-empty playlist.");
    res.status(400).send({ error: "To create a playlist, you must have an account and have a non-empty playlist" });
    return;
  }

  if (typeof userId !== "string" || typeof playlist !== "object" || typeof req.body["name"] !== "string") {
    logger.error("To create a playlist, please send account information and a non-empty playlist");
    res.status(400).send({ error: "To create a playlist, please send account information and a non-empty playlist" });
    return;
  }

  if (userId.length === 0 || playlist.length === 0 || name.length === 0) {
    logger.error("Either the user ID, playlist length, name, or combination of them is empty!");
    res.status(400).send({ error: "Either the user ID, playlist length, name, or combination of them is empty!"});
    return;
  }

  let db = await loadDatabase(database);

  if (db === undefined) {
    logger.error("Cannot get the database right now");
    res.status(500).send({ error: "Cannot get the database right now"});
    return;
  }

  let foundAccount = Object.entries(db).find((p) => p[1]["id"] === userId);


  if (!foundAccount) {
    logger.error("Cannot find account");
    res.status(404).send({ error: "Cannot find account" });
    return;
  }

  let userPlaylists = db[foundAccount[0]]["playlists"];
  
  if (userPlaylists[name] !== undefined) {
    logger.error("You already have a playlist with this name in your playlists");
    res.status(400).send({ error: "You already have a playlist with this name in your playlists" });
    return;
  }
  
  let originalLength = Object.entries(userPlaylists).length;
  userPlaylists[name] = playlist;
  await writeFile(database, JSON.stringify(db, null, 4), "utf-8");

  if (Object.entries(userPlaylists).length === originalLength) {
    logger.error("Cannot add playlist right now");
    res.status(400).send({ error: "Cannot add playlist right now" });
    return;
  }

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "POST", message: "response"`);
  logger.info("Successfully added playlist");
  res.status(201).send({ message: "Successfully added playlist", playlists: userPlaylists });
});

/**** Read Operations ****/
// Read in a user account provided a user ID and an email address
app.get("/api/account/:userId/:accountEmail", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "GET", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);
  
  let userId = req.params['userId'];
  let accountEmail = req.params['accountEmail'];
  
  if (!userId || typeof userId !== "string") {
    logger.error("Please provide a valid user ID!");
    res.status(400).send({ error: "Please provide a valid user ID!" });
    return;
  }

  if (!accountEmail || typeof accountEmail !== "string") {
    logger.error("Please provide a valid account email!");
    res.status(400).send({ error: "Please provide a valid account email!" });
    return;
  }

  if (userId.length === 0 || accountEmail.length === 0) {
    logger.error("Either the user ID or email account is an empty string!");
    res.status(400).send({ error: "Either the user ID or email account is an empty string! "});
    return;
  }

  let db = await loadDatabase(database);

  if (db === undefined) {
    logger.error("Cannot get the database right now");
    res.status(500).send({ error: "Cannot get the database right now"});
    return;
  }

  let foundAccount = Object.entries(db).find((acc) => {
    return acc[1]["id"] === userId && acc[1]["email"] === accountEmail;
  });

  if (!foundAccount) {
    logger.error("Account does not exist");
    res.status(404).send({ message: "Account does not exist" });
    return;
  }

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "GET", message: "response"`);
  logger.info(`Sending user #${foundAccount[1]['id']}'s account `);
  res.status(200).send({ message: "Successfully found account!", account: foundAccount });
});

// Read in a playlist that a user has
app.get("/api/user/:userId/playlists/:playlistName", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "GET", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);
  
  let userId = req.params['userId'];
  let playlistName = req.params['playlistName'];

  if (!userId || typeof userId !== "string") {
    logger.error("Please provide a valid user ID!");
    res.status(400).send({ error: "Please provide a valid user ID!" });
    return;
  }

  if (!playlistName || typeof playlistName !== "string") {
    logger.error("Please provide a valid playlistName!");
    res.status(400).send({ error: "Please provide a valid playlistName!" });
    return;
  }

  if (userId.length === 0 || playlistName.length === 0) {
    logger.error("The user ID or playlist name are empty strings");
    res.status(400).send({ error: "The user ID or playlist name are empty strings"});
    return;
  }

  let db = await loadDatabase(database);

  if (db === undefined) {
    logger.error("Cannot get the database right now");
    res.status(500).send({ error: "Cannot get the database right now"});
    return;
  }

  let foundAccount = Object.values(db).find((p) => p["id"] === userId);

  if (!foundAccount) {
    logger.error("Playlist not found");
    res.status(404).send({ error: "Playlist not found"});
    return;
  }

  let foundPlaylist = foundAccount["playlists"][playlistName];

  if (!foundPlaylist) {
    logger.error("Playlist not found");
    res.status(404).send({ error: "Playlist not found" });
    return;
  }

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "GET", message: "response"`);
  logger.info(`Sending playlist "${playlistName}..."`);
  res.status(200).send(foundAccount["playlists"][playlistName]);
});

// Read in a song from the song database using the song's ID
app.get("/api/song/:songId", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "GET", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);

  let songId = req.params["songId"];
  
  if (!songId || typeof songId !== "string") {
    logger.error("Please provide a valid song ID - you can see the song's ID on the song page!");
    res.status(400).send({ error: "Please provide a valid song ID - you can see the song's ID on the song page!" });
    return;
  }

  let songDb = await loadSongDatabase(songDatabase);

  if (songDb === undefined) {
    logger.error("Cannot get the song database right now");
    res.status({ error: "Cannot get the song database right now"});
    return;
  }

  let foundSong = Object.values(songDb).find((s) => s["songId"] === songId);

  if (!foundSong) {
    logger.error("Song not found");
    res.status(404).send({ error: "Song not found!" });
    return;
  }

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "GET", message: "response"`);
  logger.info(`Successfully found song "${foundSong['songName']}" with ID: ${foundSong['songId']}`);
  res.status(200).send({ message: "Successfully found song!", song: foundSong });
});

// Retrieve all songs matching 'Joyride Mode' characteristics
app.get("/api/songs/modes/joyride", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "GET", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);

  let songDb = await loadSongDatabase(songDatabase);

  if (songDb === undefined) {
    logger.error("Cannot get the song database right now");
    res.status(500).send({ error: "Cannot get the song database right now"});
    return;
  }

  let joyridePlaylist = Object.values(songDb).filter((s) => {
    let songVolume = s["characteristics"]["volume"];
    let songEnergy = s["characteristics"]["energy"];
    let songRhythm = s["characteristics"]["rhythm"];
    let songPositivity = s["characteristics"]["positivity"];

    return songVolume >= 75.0 && songEnergy >= 75.0 && songRhythm >= 75.0 && songPositivity >= 50.0;
  });

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "GET", message: "response"`);
  logger.info("Sending 'On A Mission Mode' playlist...");
  res.status(200).send({ message: "Joyride Mode", playlist: joyridePlaylist });
});

// Retrieve all songs matching 'On A Mission Mode' characteristics
app.get("/api/songs/modes/on-a-mission", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "GET", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);
  let songDb = await loadSongDatabase(songDatabase);

  if (songDb === undefined) {
    logger.error("Cannot get the song database right now");
    res.status(500).send({ error: "Cannot get the song database right now"});
    return;
  }

  let onAMissionPlaylist = Object.values(songDb).filter((s) => {
    let songVolume = s["characteristics"]["volume"];
    let songEnergy = s["characteristics"]["energy"];
    let songRhythm = s["characteristics"]["rhythm"];

    return songVolume <= 30.0 && songEnergy <= 30.0 && songRhythm <= 30.0;
  });

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "GET", message: "response"`);
  logger.info("Sending 'On A Mission Mode' playlist...");
  res.status(200).send({ message: "On A Mission Mode", playlist: onAMissionPlaylist });
});

// Retrieve all songs matching 'Cruisin Mode' characteristics
app.get("/api/songs/modes/cruisin", async (req, res) => {  
  logger.http(JSON.stringify({ message: "request", method: "GET", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);
  let songDb = await loadSongDatabase(songDatabase);

  if (songDb === undefined) {
    logger.error("Cannot get the song database right now");
    res.status(500).send({ error: "Cannot get the song database right now"});
    return;
  }

  let crusinPlaylist = Object.values(songDb).filter((s) => {
    let songVolume = s["characteristics"]["volume"];
    let songEnergy = s["characteristics"]["energy"];
    let songRhythm = s["characteristics"]["rhythm"];

    return songVolume <= 75.0 && songEnergy <= 75.0 && songRhythm <= 50.0;
  });

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "GET", message: "response"`);
  logger.info("Sending 'Cruisin' playlist...");
  res.status(200).send({ message: "Cruisin' Mode", playlist: crusinPlaylist });
});

/**** Update operations ****/
app.put("/api/user/:userId", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "PUT", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);
  let userId = req.params["userId"];
  let updatedPassword = req.body["password"];
  let firstName = req.body["firstName"];
  let lastName = req.body["lastName"];
  let fullName = req.body["fullName"];
  let email = req.body["email"];

  if (!userId || !updatedPassword || !firstName || !lastName || !fullName || !email) {
    logger.error("Please provide updated fields for your account information");
    res.status(400).send({ error: "Please provide updated fields for your account information!" });
    return;
  }

  if (typeof updatedPassword !== "string" || typeof firstName !== "string" || typeof lastName !== "string" || 
      typeof fullName !== "string" || typeof email !== "string") {
      logger.error("All inputs must be of type string");
      res.status(400).send({ error: "All inputs must be of type string" });
      return;
  }

  if (userId.length === 0) {
    logger.error("Please send an ID that is valid");
    res.status(400).send({ error: "Please send an ID that is valid" });
    return;
  }

  if (updatedPassword.length === 0 || firstName.length === 0 || lastName.length === 0 ||
      fullName.length === 0 || email.length === 0) {
        logger.error("One or more of the updated fields is an empty string!");
        res.status(400).send({ error: "One or more of the updated fields is an empty string!" });
        return;
  }

  let db = await loadDatabase(database);

  if (db === undefined) {
    logger.error("Cannot get the database right now");
    res.status(500).send({ error: "Cannot get the database right now"});
    return;
  }

  let foundAccount = Object.entries(db).find((p) => p[1]["id"] === userId);

  if (foundAccount === undefined) {
    logger.error("User is not in database");
    res.status(404).send({ error: "User is not in database" });
    return;
  }

  db[foundAccount[0]]["password"] = updatedPassword;
  db[foundAccount[0]]["firstName"] = firstName;
  db[foundAccount[0]]["lastName"] = lastName;
  db[foundAccount[0]]["fullName"] = fullName;
  db[foundAccount[0]]["email"] = email;

  await writeFile(database, JSON.stringify(db, null, 4), "utf-8");

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "PUT", message: "response"`);
  logger.info(`Successfully updated account ${db[foundAccount[0]]['id']}`);
  res.status(200).send({ message: "Successfully updated account!", updatedAccount: db[foundAccount[0]] });
});

// Add a song to an existing playlist
app.put("/api/user/:userId/playlists/:playlistName", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "PUT", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);

  let userId = req.params['userId'];
  let playlistName = req.params['playlistName'];

  if (!userId || typeof userId !== "string") {
    logger.error("Please provide a valid user ID!");
    res.status(400).send({ error: "Please provide a valid user ID!" });
    return;
  }

  if (!playlistName || typeof playlistName !== "string") {
    logger.error("Please provide a valid playlistName!");
    res.status(400).send({ error: "Please provide a valid playlistName!" });
    return;
  }

  let songlist = req.body[playlistName];

  let db = await loadDatabase(database);

  if (db === undefined) {
    logger.error("Cannot get the database right now");
    res.status(500).send({ error: "Cannot get the database right now"});
    return;
  }

  let foundAccount = Object.entries(db).find((p) => {
    if (p[1]["id"] === userId) {
      return p;
    }
  });

  let foundAccountAndPlaylist = Object.entries(db).find((p) => {
    if (p[1]["playlists"].hasOwnProperty(playlistName) && p[1]["id"] === userId) {
      return p;
    }
  });
  
  // Check if a user's account is in the account database
  if (foundAccount === undefined) {
    logger.error("Account not found");
    res.status(404).send({ error: "Account not found" });
    return;
  }

  // Check if a user's account is in the database 
  // and does not have the provided playlist
  if (foundAccount && !foundAccountAndPlaylist) {
    logger.error("Playlist not found");
    res.status(404).send({ error: "Playlist not found" });
    return;
  }

  let account = foundAccount[0];
  db[`${account}`]['playlists'][`${playlistName}`] = songlist;

  await writeFile(database, JSON.stringify(db, null, 4), "utf-8");

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "PUT", message: "response"`);
  logger.info(`Successfully updated playlist "${playlistName}"`);
  let updatedPlaylist = {};
  updatedPlaylist[`${playlistName}`] = songlist
  res.status(200).send({ message: "Successfully updated playlist!", updatedPlaylist });
});

/**** DELETE Operations ****/
// Delete a user account
app.delete("/api/user/:userId", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "DELETE", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);

  let userId = req.params['userId'];

  if (!userId || typeof userId !== "string") {
    logger.error("Please provide a valid user ID!");
    res.status(400).send({ error: "Please provide a valid user ID!" });
    return;
  }

  let db = await loadDatabase(database);

  if (db === undefined) {
    logger.error("Cannot get the database right now");
    res.status(500).send({ error: "Cannot get the database right now"});
    return;
  }

  let foundAccount = Object.entries(db).find((p) => p[1]["id"] === userId);
  if (foundAccount === undefined) {
    logger.error("Account not found!");
    res.status(404).send({ error: "Account not found!" });
    return;
  }

  let account = foundAccount[0];
  delete db[account];

  await writeFile(database, JSON.stringify(db, null, 4), "utf-8");

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "DELETE", message: "response"`);
  logger.info(`Successfully deleted account ${account['id']}`);

  res.status(200).send({ 
    message: "Successfully deleted account!  Orbitus is sad to see you go.  Please feel free to stream on our platform anytime!",
  });
});

app.delete("/api/user/:userId/playlists/:playlistName", async (req, res) => {
  logger.http(JSON.stringify({ message: "request", method: "DELETE", time: Date.now() }));
  let route = JSON.stringify(req.route['path']);
  
  let userId = req.params['userId'];
  let playlistName = req.params['playlistName'];

  if (!userId || typeof userId !== "string") {
    logger.error("Please provide a valid user ID!");
    res.status(400).send({ error: "Please provide a valid user ID!" });
    return;
  }

  if (!playlistName || typeof playlistName !== "string") {
    logger.error("Please provide a valid playlistName!");
    res.status(400).send({ error: "Please provide a valid playlistName!" });
    return;
  }

  if (userId.length === 0 || playlistName.length === 0) {
    res.status(400).send({ error: "The account ID and playlist strings cannot be empty!" });
    return;
  }

  let db = await loadDatabase(database);

  if (db === undefined) {
    logger.error("Cannot get the database right now");
    res.status(500).send({ error: "Cannot get the database right now"});
    return;
  }

  let foundAccount = Object.entries(db).find((p) => {
      if (p[1]["id"] === userId && p[1]["playlists"].hasOwnProperty(playlistName)) {
        return p;
      }
  });

  if (foundAccount === undefined) {
    logger.error("Playlist not found!");
    res.status(404).send({ error: "Playlist not found!" });
    return;
  }

  let account = foundAccount[0];
  delete db[account]["playlists"][playlistName];

  await writeFile(database, JSON.stringify(db, null, 4), "utf-8");

  logger.http(`statusCode: "200", route: ${route}, time: ${Date.now()}, method: "DELETE", message: "response"`);
  logger.info(`Successfully deleted playlist "${playlistName}"`);

  res.status(200).send({ message: "Successfully deleted playlist!" });
});

/**** 🚀 Start the server! 🚀 ****/
app.listen(port, () => {
  // The server when started with nodemon will reload
  // when index.js is changed and saved
  console.log(`Server is now listening on port ${port}`);
});