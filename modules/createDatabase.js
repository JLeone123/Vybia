import { readFile, writeFile, access } from "fs/promises";
// import { loadDatabases, loadSongDatabase } from "./index.js";

export const createDatabase = async (filename) => {
  const database = {
    person_1: {
      id: "8c6efe348c3d5a2d2aef1acc",
      password: "7sTu",
      firstName: "Peter",
      lastName: "Parker",
      fullName: "Peter Parker",
      email: "Peter71@yahoo.com",
      playlists: {
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
      },
    },
    person_2: {
      id: "58c7b9dfd8af34cebc6fbddb",
      password: "jknqr",
      firstName: "Vicki",
      lastName: "Connelly",
      fullName: "Vicki Connelly",
      email: "Vicki92@hotmail.com",
      playlists: {
        playlist_1: [
          {
            song_1: {
              songId: "cbefe65c19aadd2f4faa834a",
              mp3: "cbefe6_up_up_&_away_orland_hirthe.mp3",
              songName: "Up Up & Away",
              artistName: "Orland Hirthe",
              albumName: "Come On-a My House",
              genre: "Hip Hop / Rap",
              characteristics: {
                volume: 42.9274,
                energy: 61.6399,
                rhythm: 70.8337,
                positivity: 86.2109,
              },
            },
          },
          {
            song_2: {
              songId: "52c82dfebbc3e9cbef9ac4ae",
              mp3: "52c82d_blaze_of_glory_santina_shields.mp3",
              songName: "Blaze of Glory",
              artistName: "Santina Shields",
              albumName: "You're So Vain",
              genre: "Country",
              characteristics: {
                volume: 98.2953,
                energy: 68.5261,
                rhythm: 97.6856,
                positivity: 7.4014,
              },
            },
          },
          {
            song_3: {
              songId: "eb6618e0d1bda2b3e95ba4f5",
              mp3: "eb6618_too_close_mylene_lebsack.mp3",
              songName: "Too Close",
              artistName: "Mylene Lebsack",
              albumName: "(You Keep Me) Hangin' On",
              genre: "Pop",
              characteristics: {
                volume: 92.2773,
                energy: 70.1897,
                rhythm: 90.3984,
                positivity: 9.7638,
              },
            },
          },
          {
            song_4: {
              songId: "ab63cc5008a20ba5f68b1a08",
              mp3: "ab63cc_down_marcia_carroll.mp3",
              songName: "Down",
              artistName: "Marcia Carroll",
              albumName: "He's So Fine",
              genre: "Country",
              characteristics: {
                volume: 18.1373,
                energy: 48.4585,
                rhythm: 43.3541,
                positivity: 6.6124,
              },
            },
          },
          {
            song_5: {
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
        ],
      },
    },
    person_3: {
      id: "c21adf6ff3bac91fcfd8be0a",
      password: "C9AdK4",
      firstName: "Theodore",
      lastName: "Dietrich",
      fullName: "Theodore Dietrich",
      email: "Theodore.Dietrich59@yahoo.com",
      playlists: {
        playlist_1: [
          {
            song_1: {
              songId: "4ddf72bcfc79aa4cc32aa3ff",
              mp3: "4ddf72_ol'_man_river_faye_roob.mp3",
              songName: "Ol' Man River",
              artistName: "Faye Roob",
              albumName: "Bohemian Rhapsody",
              genre: "Jazz",
              characteristics: {
                volume: 89.907,
                energy: 31.5033,
                rhythm: 84.0835,
                positivity: 91.3678,
              },
            },
          },
          {
            song_2: {
              songId: "ddee4f32e785b8dce3ef3cce",
              mp3: "ddee4f_he's_so_fine_karen_will.mp3",
              songName: "He's So Fine",
              artistName: "Karen Will",
              albumName: "Reunited",
              genre: "Electronic",
              characteristics: {
                volume: 43.8323,
                energy: 61.8067,
                rhythm: 13.8218,
                positivity: 81.2698,
              },
            },
          },
          {
            song_3: {
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
            song_4: {
              songId: "e08136a6b8b68da11b7464cb",
              mp3: "e08136_i'll_be_seeing_you_cordell_lueilwitz.mp3",
              songName: "I'll be seeing you",
              artistName: "Cordell Lueilwitz",
              albumName: "Big Bad John",
              genre: "Hip Hop / Rap",
              characteristics: {
                volume: 78.586,
                energy: 27.9744,
                rhythm: 57.5726,
                positivity: 2.9164,
              },
            },
          },
          {
            song_5: {
              songId: "12e9b0b80203df92addeeffb",
              mp3: "12e9b0_king_of_the_road_humberto_metz.mp3",
              songName: "King of the Road",
              artistName: "Humberto Metz",
              albumName: "In the Year 2525 (Exordium & Terminus)",
              genre: "Hip Hop / Rap",
              characteristics: {
                volume: 63.2094,
                energy: 42.058,
                rhythm: 80.7082,
                positivity: 9.8467,
              },
            },
          },
        ],
      },
    },
    person_4: {
      id: "e166f13cfebaebdd77fd5fb0",
      password: "6xZXHe2_eh2k",
      firstName: "Mona",
      lastName: "Medhurst-Koss",
      fullName: "Mona Medhurst-Koss",
      email: "Mona.Medhurst-Koss25@gmail.com",
      playlists: {
        playlist_1: [
          {
            song_1: {
              songId: "aefa53133c5f0c8c80a28dca",
              mp3: "aefa53_healing_joany_kerluke.mp3",
              songName: "Healing",
              artistName: "Joany Kerluke",
              albumName: "I Can Dream",
              genre: "Electronic",
              characteristics: {
                volume: 7.9872,
                energy: 5.2223,
                rhythm: 13.0975,
                positivity: 95.8532,
              },
            },
          },
          {
            song_2: {
              songId: "beeddbf3debad7d3fe9b6865",
              mp3: "beeddb_all_i_have_to_do_is_dream_susanna_brown.mp3",
              songName: "All I Have to Do is Dream",
              artistName: "Susanna Brown",
              albumName: "Black Or White",
              genre: "Pop",
              characteristics: {
                volume: 0.3177,
                energy: 76.0214,
                rhythm: 74.7008,
                positivity: 77.5454,
              },
            },
          },
          {
            song_3: {
              songId: "7bf3bbf9fb5e09ab9fbddcbd",
              mp3: "7bf3bb_i_just_wanna_be_your_everything_velda_smitham.mp3",
              songName: "I Just Wanna Be Your Everything",
              artistName: "Velda Smitham",
              albumName: "Whispering",
              genre: "Jazz",
              characteristics: {
                volume: 93.4667,
                energy: 17.934,
                rhythm: 12.76,
                positivity: 66.8826,
              },
            },
          },
          {
            song_4: {
              songId: "cddca2b76da10fefd07d33bd",
              mp3: "cddca2_baby_love_dianna_bins.mp3",
              songName: "Baby Love",
              artistName: "Dianna Bins",
              albumName: "Like a Prayer",
              genre: "Country",
              characteristics: {
                volume: 80.4521,
                energy: 98.9806,
                rhythm: 68.0454,
                positivity: 62.9267,
              },
            },
          },
          {
            song_5: {
              songId: "7bf3bbf9fb5e09ab9fbddcbd",
              mp3: "7bf3bb_i_just_wanna_be_your_everything_velda_smitham.mp3",
              songName: "I Just Wanna Be Your Everything",
              artistName: "Velda Smitham",
              albumName: "Whispering",
              genre: "Jazz",
              characteristics: {
                volume: 93.4667,
                energy: 17.934,
                rhythm: 12.76,
                positivity: 66.8826,
              },
            },
          },
        ],
      },
    },
    person_5: {
      id: "ed0ccdc2d70ca9ac8321bad3",
      password: "m0pfzeO",
      firstName: "Ruben",
      lastName: "Zieme",
      fullName: "Ruben Zieme",
      email: "Ruben_Zieme14@yahoo.com",
      playlists: {
        playlist_1: [
          {
            song_1: {
              songId: "761849fe66ecaa062576e926",
              mp3: "761849_smoke_on_the_water_morris_mcclure.mp3",
              songName: "Smoke On the Water",
              artistName: "Morris McClure",
              albumName: "Never Gonna Give You Up",
              genre: "Jazz",
              characteristics: {
                volume: 92.0912,
                energy: 80.6399,
                rhythm: 6.3984,
                positivity: 28.6051,
              },
            },
          },
          {
            song_2: {
              songId: "98a0b04cd1520a7095da3ded",
              mp3: "98a0b0_cherish_larissa_wiza.mp3",
              songName: "Cherish",
              artistName: "Larissa Wiza",
              albumName: "The Thing",
              genre: "Country",
              characteristics: {
                volume: 18.5501,
                energy: 8.958,
                rhythm: 55.5964,
                positivity: 91.3275,
              },
            },
          },
          {
            song_3: {
              songId: "beeddbf3debad7d3fe9b6865",
              mp3: "beeddb_all_i_have_to_do_is_dream_susanna_brown.mp3",
              songName: "All I Have to Do is Dream",
              artistName: "Susanna Brown",
              albumName: "Black Or White",
              genre: "Pop",
              characteristics: {
                volume: 0.3177,
                energy: 76.0214,
                rhythm: 74.7008,
                positivity: 77.5454,
              },
            },
          },
          {
            song_4: {
              songId: "8da42c20d97aae5b5ad769f6",
              mp3: "8da42c_the_love_you_save_enoch_breitenberg.mp3",
              songName: "The Love You Save",
              artistName: "Enoch Breitenberg",
              albumName: "Let's Get it On",
              genre: "Rock",
              characteristics: {
                volume: 71.0123,
                energy: 98.2484,
                rhythm: 79.9944,
                positivity: 73.4851,
              },
            },
          },
          {
            song_5: {
              songId: "bd8a2edaff1481a37de8aa0e",
              mp3: "bd8a2e_rehab_marco_powlowski.mp3",
              songName: "Rehab",
              artistName: "Marco Powlowski",
              albumName: "You Are the Sunshine of My Life",
              genre: "Indie",
              characteristics: {
                volume: 38.5773,
                energy: 38.4035,
                rhythm: 65.4408,
                positivity: 61.2027,
              },
            },
          },
        ],
      },
    },
    person_6: {
      id: "e461ebcd9575e72a97333ed5",
      password: "NNzJXenWdH01W",
      firstName: "Hilda",
      lastName: "Bernier",
      fullName: "Hilda Bernier",
      email: "Hilda.Bernier@hotmail.com",
      playlists: {
        playlist_1: [
          {
            song_1: {
              songId: "beed9c4dcfda4cdcb1c86260",
              mp3: "beed9c_kiss_you_all_over_darrion_kilback.mp3",
              songName: "Kiss You All Over",
              artistName: "Darrion Kilback",
              albumName:
                "That Lucky Old Sun (Just Rolls Around Heaven All Day)",
              genre: "Lofi / Chillhop",
              characteristics: {
                volume: 25.0203,
                energy: 75.6583,
                rhythm: 21.5212,
                positivity: 9.8942,
              },
            },
          },
          {
            song_2: {
              songId: "e997b55ccbbbfe07a235f5f7",
              mp3: "e997b5_the_streak_sienna_stanton.mp3",
              songName: "The Streak",
              artistName: "Sienna Stanton",
              albumName: "Theme From 'A Summer Place'",
              genre: "Country",
              characteristics: {
                volume: 64.9405,
                energy: 19.9575,
                rhythm: 32.9538,
                positivity: 9.0184,
              },
            },
          },
          {
            song_3: {
              songId: "4c542ae3bc1e3fe097fb8bb0",
              mp3: "4c542a_honey_aracely_satterfield.mp3",
              songName: "Honey",
              artistName: "Aracely Satterfield",
              albumName: "End of the Road",
              genre: "Indie",
              characteristics: {
                volume: 10.1765,
                energy: 29.6561,
                rhythm: 0.1442,
                positivity: 93.2865,
              },
            },
          },
          {
            song_4: {
              songId: "44dc0104caaf93aac13a4123",
              mp3: "44dc01_sir_duke_josie_mohr.mp3",
              songName: "Sir Duke",
              artistName: "Josie Mohr",
              albumName: "Hair",
              genre: "Country",
              characteristics: {
                volume: 83.1759,
                energy: 87.7599,
                rhythm: 79.6325,
                positivity: 62.7426,
              },
            },
          },
          {
            song_5: {
              songId: "d7be39f76e43f473fc8eddeb",
              mp3: "d7be39_miss_you_much_desiree_durgan.mp3",
              songName: "Miss You Much",
              artistName: "Desiree Durgan",
              albumName: "End of the Road",
              genre: "Rock",
              characteristics: {
                volume: 97.7778,
                energy: 53.1632,
                rhythm: 18.153,
                positivity: 88.3651,
              },
            },
          },
        ],
      },
    },
    person_7: {
      id: "6bfdbfa16ee13fff8aa276cd",
      password: "oHNQdEg_jeES",
      firstName: "Wilfred",
      lastName: "Senger",
      fullName: "Wilfred Senger",
      email: "Wilfred99@hotmail.com",
      playlists: {
        playlist_1: [
          {
            song_1: {
              songId: "dfb31ef34d31bd117cda1b18",
              mp3: "dfb31e_ghostbusters_santa_wiza.mp3",
              songName: "Ghostbusters",
              artistName: "Santa Wiza",
              albumName: "Will You Love Me Tomorrow",
              genre: "Electronic",
              characteristics: {
                volume: 96.3995,
                energy: 71.7555,
                rhythm: 48.3298,
                positivity: 49.1542,
              },
            },
          },
          {
            song_2: {
              songId: "8ccc9ae355a2f4abb2ad1b8a",
              mp3: "8ccc9a_the_prisoner's_song_jerad_kunde.mp3",
              songName: "The Prisoner's Song",
              artistName: "Jerad Kunde",
              albumName: "Philadelphia Freedom",
              genre: "Indie",
              characteristics: {
                volume: 64.2511,
                energy: 87.167,
                rhythm: 81.644,
                positivity: 68.8979,
              },
            },
          },
          {
            song_3: {
              songId: "dcc6ac1b8601db4b1eacfbd8",
              mp3: "dcc6ac_you_make_me_feel_like_dancing_maida_bode.mp3",
              songName: "You Make Me Feel Like Dancing",
              artistName: "Maida Bode",
              albumName: "Mr Brightside",
              genre: "Indie",
              characteristics: {
                volume: 7.1377,
                energy: 26.9046,
                rhythm: 13.0637,
                positivity: 92.9439,
              },
            },
          },
          {
            song_4: {
              songId: "196c86fdb4b48f07eaeaeaf7",
              mp3: "196c86_hound_dog_nathen_wilderman.mp3",
              songName: "Hound Dog",
              artistName: "Nathen Wilderman",
              albumName: "I Want You Back",
              genre: "Electronic",
              characteristics: {
                volume: 71.8675,
                energy: 61.9267,
                rhythm: 95.1254,
                positivity: 67.0153,
              },
            },
          },
          {
            song_5: {
              songId: "db645f2b789aa05a66ee2ea7",
              mp3: "db645f_stairway_to_heaven_cicero_wisoky.mp3",
              songName: "Stairway to Heaven",
              artistName: "Cicero Wisoky",
              albumName: "The Sign",
              genre: "R&B",
              characteristics: {
                volume: 17.6562,
                energy: 88.1918,
                rhythm: 92.6617,
                positivity: 93.7484,
              },
            },
          },
        ],
      },
    },
    person_8: {
      id: "ace913bac3d8953eccfcebf3",
      password: "BPQ3nvRKboTd855",
      firstName: "Jodi",
      lastName: "Beahan",
      fullName: "Jodi Beahan",
      email: "Jodi_Beahan@yahoo.com",
      playlists: {
        playlist_1: [
          {
            song_1: {
              songId: "eeaf6f8890bbeba961a135ea",
              mp3: "eeaf6f_(everything_i_do)_i_do_it_for_you_hulda_lindgren.mp3",
              songName: "(Everything I Do) I Do it For You",
              artistName: "Hulda Lindgren",
              albumName: "Take The 'A' Train",
              genre: "Electronic",
              characteristics: {
                volume: 81.6614,
                energy: 36.5872,
                rhythm: 93.3069,
                positivity: 86.5948,
              },
            },
          },
          {
            song_2: {
              songId: "f9b8f63c9999db3a68e0adb9",
              mp3: "f9b8f6_grenade_melisa_kertzmann.mp3",
              songName: "Grenade",
              artistName: "Melisa Kertzmann",
              albumName: "The Thing",
              genre: "Pop",
              characteristics: {
                volume: 30.8873,
                energy: 60.0863,
                rhythm: 89.256,
                positivity: 20.2054,
              },
            },
          },
          {
            song_3: {
              songId: "a2e6eca71df5cafbacefa6da",
              mp3: "a2e6ec_how_do_you_mend_a_broken_heart_lucius_willms.mp3",
              songName: "How Do You Mend a Broken Heart",
              artistName: "Lucius Willms",
              albumName: "Rag Doll",
              genre: "Rock",
              characteristics: {
                volume: 2.2327,
                energy: 32.4835,
                rhythm: 23.3792,
                positivity: 34.3847,
              },
            },
          },
          {
            song_4: {
              songId: "7dbdb131e9b7e0bbf56cd3c7",
              mp3: "7dbdb1_stormy_weather_(keeps_rainin'_all_the_time)_vincent_bauch.mp3",
              songName: "Stormy Weather (Keeps Rainin' All the Time)",
              artistName: "Vincent Bauch",
              albumName: "Lean On Me",
              genre: "Hip Hop / Rap",
              characteristics: {
                volume: 40.1783,
                energy: 84.2353,
                rhythm: 64.2385,
                positivity: 71.8002,
              },
            },
          },
          {
            song_5: {
              songId: "dcc6ac1b8601db4b1eacfbd8",
              mp3: "dcc6ac_you_make_me_feel_like_dancing_maida_bode.mp3",
              songName: "You Make Me Feel Like Dancing",
              artistName: "Maida Bode",
              albumName: "Mr Brightside",
              genre: "Indie",
              characteristics: {
                volume: 7.1377,
                energy: 26.9046,
                rhythm: 13.0637,
                positivity: 92.9439,
              },
            },
          },
        ],
      },
    },
    person_9: {
      id: "b577bb6a609dc4a61debe6cc",
      password: "Y8qB69llIAY",
      firstName: "Darrel",
      lastName: "Wolf",
      fullName: "Darrel Wolf",
      email: "Darrel38@gmail.com",
      playlists: {
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
            song_3: {
              songId: "fbc1a150ae4caebb9e371d6c",
              mp3: "fbc1a1_every_breath_you_take_dave_bauch.mp3",
              songName: "Every Breath You Take",
              artistName: "Dave Bauch",
              albumName: "The Power of Love",
              genre: "Country",
              characteristics: {
                volume: 43.927,
                energy: 20.0979,
                rhythm: 92.9043,
                positivity: 62.1282,
              },
            },
          },
          {
            song_4: {
              songId: "ddee4f32e785b8dce3ef3cce",
              mp3: "ddee4f_he's_so_fine_karen_will.mp3",
              songName: "He's So Fine",
              artistName: "Karen Will",
              albumName: "Reunited",
              genre: "Electronic",
              characteristics: {
                volume: 43.8323,
                energy: 61.8067,
                rhythm: 13.8218,
                positivity: 81.2698,
              },
            },
          },
          {
            song_5: {
              songId: "196c86fdb4b48f07eaeaeaf7",
              mp3: "196c86_hound_dog_nathen_wilderman.mp3",
              songName: "Hound Dog",
              artistName: "Nathen Wilderman",
              albumName: "I Want You Back",
              genre: "Electronic",
              characteristics: {
                volume: 71.8675,
                energy: 61.9267,
                rhythm: 95.1254,
                positivity: 67.0153,
              },
            },
          },
        ],
      },
    },
    person_10: {
      id: "46ef1597233dab2f9f7d1a93",
      password: "h6A4fGC_ziVgO",
      firstName: "Blanche",
      lastName: "Kovacek",
      fullName: "Blanche Kovacek",
      email: "Blanche7@hotmail.com",
      playlists: {
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
              songId: "5ab5ed97c2e602d1e3c347e7",
              mp3: "5ab5ed_physical_andy_larson.mp3",
              songName: "Physical",
              artistName: "Andy Larson",
              albumName: "Runaway",
              genre: "Indie",
              characteristics: {
                volume: 67.3054,
                energy: 94.1971,
                rhythm: 7.0763,
                positivity: 88.9103,
              },
            },
          },
          {
            song_3: {
              songId: "ff6ed53beff35e3ce4d63b16",
              mp3: "ff6ed5_blueberry_hill_doris_bartoletti.mp3",
              songName: "Blueberry Hill",
              artistName: "Doris Bartoletti",
              albumName: "I've Heard That Song Before",
              genre: "R&B",
              characteristics: {
                volume: 53.6548,
                energy: 32.9882,
                rhythm: 3.3416,
                positivity: 86.34,
              },
            },
          },
          {
            song_4: {
              songId: "196c86fdb4b48f07eaeaeaf7",
              mp3: "196c86_hound_dog_nathen_wilderman.mp3",
              songName: "Hound Dog",
              artistName: "Nathen Wilderman",
              albumName: "I Want You Back",
              genre: "Electronic",
              characteristics: {
                volume: 71.8675,
                energy: 61.9267,
                rhythm: 95.1254,
                positivity: 67.0153,
              },
            },
          },
          {
            song_5: {
              songId: "aefa53133c5f0c8c80a28dca",
              mp3: "aefa53_healing_joany_kerluke.mp3",
              songName: "Healing",
              artistName: "Joany Kerluke",
              albumName: "I Can Dream",
              genre: "Electronic",
              characteristics: {
                volume: 7.9872,
                energy: 5.2223,
                rhythm: 13.0975,
                positivity: 95.8532,
              },
            },
          },
        ],
      },
    },
    person_11: {
      id: "c7d1a7d167c990cddd6449ad",
      password: "123456789",
      firstName: "James",
      lastName: "Lion",
      fullName: "James Leone",
      email: "jleone123@yahoo.com",
      playlists: {},
    },
    person_12: {
      id: "0f2cfcffebbbe83f181bc8d1",
      password: "VaZ4q_C6w7otq",
      firstName: "Michael",
      lastName: "Leone",
      fullName: "Michael Leone",
      email: "mleone456@yahoo.com",
      playlists: {},
    },
  };

  await writeFile(filename, JSON.stringify(database, null, 4), "utf-8");
};

// createDatabase();