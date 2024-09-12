import { createDatabase } from "./createDatabase.js";
import { readFile, access } from "fs/promises";
import { constants } from "fs";


export const loadDatabase = async (filename) => {
  try {
    await access(filename, constants.R_OK | constants.W_OK);
    console.log(`Can access the database ${filename}`);
    let json = await readFile(filename, "utf-8");
    return await JSON.parse(json);
  } catch (err) {
    console.log(`Need to create the file ${filename} to access it`);
    await createDatabase(filename);
    let json = await readFile(filename, "utf-8");
    return await JSON.parse(json);
  }
};