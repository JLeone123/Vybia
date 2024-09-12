import { faker } from "@faker-js/faker";

const exampleGenres = [
  "Pop",
  "Punk",
  "Rock",
  "Hip Hop / Rap",
  "Lofi / Chillhop",
  "Jazz",
  "R&B",
  "Country",
  "Indie",
  "Electronic",
];

// Create song
export const createSong = () => {
  let randomGenreIndex = Math.floor(Math.random() * 10);
  // create example song data
  let exampleSongId = faker.database.mongodbObjectId();
  let exampleSong = faker.music.songName();
  let exampleAlbum = faker.music.songName();
  let exampleGenre = exampleGenres[randomGenreIndex];

  // Create example artist
  let exArtistFName = faker.person.firstName();
  let exArtistLName = faker.person.lastName();
  let exArtistName = `${exArtistFName} ${exArtistLName}`;
  let exArtistFileName = exArtistName.split(" ").join("_").toLowerCase();

  // Create example mp3 audio (this is supposed to be fake data,
  // however in my project I would like to use real mp3 audio files!)
  // The fake mp3 file name uses the first six letters of the example
  // song id, the name of the song, and the name of the artist
  // all in snake-case.
  let exampleSongFileName = exampleSong.split(" ").join("_").toLowerCase();
  let exampleAudioLink = `${exampleSongId.slice(
    0,
    6
  )}_${exampleSongFileName}_${exArtistFileName}.mp3`;

  // Create example song characteristics
  let exampleVolume = Number((Math.random() * 100).toFixed(4));
  let exampleEnergy = Number((Math.random() * 100).toFixed(4));
  let exampleRhythm = Number((Math.random() * 100).toFixed(4));
  let examplePositivity = Number((Math.random() * 100).toFixed(4));

  let exampleCharacteristics = {
    volume: exampleVolume,
    energy: exampleEnergy,
    rhythm: exampleRhythm,
    positivity: examplePositivity,
  };

  let newSong = {
    songId: exampleSongId,
    mp3: exampleAudioLink,
    songName: exampleSong,
    artistName: exArtistName,
    albumName: exampleAlbum,
    genre: exampleGenre,
    characteristics: exampleCharacteristics,
  };
  return newSong;
};
