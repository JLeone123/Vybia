import { faker } from "@faker-js/faker";
import { readFile, writeFile, access } from "fs/promises";
// import { loadDatabases, loadSongDatabase } from "./index.js";
import { createSong } from "./helper_functions/createSong.js";

// Create playlist:
const createPlaylist = async (emptyArray, numberOfSongs, songDatabaseFileName) => {
  let songDatabase = await loadSongDatabase(songDatabaseFileName);

  for (let i = 0; i < numberOfSongs; ++i) {
    let randomIndexInSongDatabase = Math.floor(Math.random() * 100);

    emptyArray[i] = {
        [`song_${i + 1}`]: songDatabase[`song_${randomIndexInSongDatabase + 1}`]
    }
  }

  return emptyArray;
};

export const createSongDb = async (filename) => {
    if (typeof filename !== "string") {
      throw new Error("Type error - input must be a string!");
    }
  
    if (filename.length === 0) {
      throw new Error("Argument error - please provide a string as a filename");
    }
  
    if (filename.slice(-5) !== ".json") {
      throw new Error("Filename error - filename must be a JSON file!");
    }
  
    let songDatabase = {};
  
    for (let i = 0; i < 100; ++i) {
      songDatabase[`song_${i + 1}`] = createSong();
    }
  
    await writeFile(filename, JSON.stringify(songDatabase, null, 4), "utf-8");
  };

export const createData = async (filename, songDatabase) => {
  if (typeof filename !== "string") {
    throw new Error("Type error - input must be a string!");
  }

  if (filename.length === 0) {
    throw new Error("Argument error - please provide a string as a filename");
  }

  if (filename.slice(-5) !== ".json") {
    throw new Error("Filename error - filename must be a JSON file!");
  }

  const db = {};

  for (let i = 1; i < 11; ++i) {
    let sex = "";

    if (i % 2 === 0) {
      sex = "female";
    } else {
      sex = "male";
    }

    let firstName = faker.person.firstName(sex);
    let lastName = faker.person.lastName(sex);

    let fullName = `${firstName} ${lastName}`;

    let exampleEmail = faker.internet.email({
      firstName: firstName,
      lastName: lastName,
    });

    let examplePlaylist = await createPlaylist([], 5, songDatabase);

    db[`person_${i}`] = {
      id: faker.database.mongodbObjectId(),
      password: faker.internet.password({
        length: Math.floor(Math.random() * (17 - 4) + 4),
      }),
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,
      email: exampleEmail,
      playlists: {
        playlist_1: examplePlaylist,
      },
    };
  }

  await writeFile(filename, JSON.stringify(db, null, 4), "utf-8");
};