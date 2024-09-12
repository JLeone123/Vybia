import { createSongDatabase } from "./createSongDatabase.js";
import { readFile, access } from "fs/promises";
import { constants } from "fs";


export const loadSongDatabase = async (songFileName) => {
  try {
    await access(songFileName, constants.R_OK | constants.W_OK);
    console.log(`Can access song database: ${songFileName}`);
    let json = await readFile(songFileName, "utf-8");
    return await JSON.parse(json);
  } catch (err) {
    console.log(`Need to create the song database file ${songFileName} to access it`);
    await createSongDatabase(songFileName);
    let json = await readFile(songFileName, "utf-8");
    return await JSON.parse(json);
  }
};
