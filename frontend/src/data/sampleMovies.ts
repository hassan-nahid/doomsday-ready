export const SAMPLE_MCU_MOVIES = [
  { title: "Iron Man", releaseYear: 2008, runtimeMinutes: 126, prereqs: [] },
  {
    title: "Captain America: The First Avenger",
    releaseYear: 2011,
    runtimeMinutes: 124,
    prereqs: [],
  },
  {
    title: "The Avengers",
    releaseYear: 2012,
    runtimeMinutes: 143,
    prereqs: ["Iron Man", "Captain America: The First Avenger"],
  },
  {
    title: "Captain America: Civil War",
    releaseYear: 2016,
    runtimeMinutes: 147,
    prereqs: ["The Avengers"],
  },
  {
    title: "Thor: Ragnarok",
    releaseYear: 2017,
    runtimeMinutes: 130,
    prereqs: [],
  },
  {
    title: "Avengers: Infinity War",
    releaseYear: 2018,
    runtimeMinutes: 149,
    prereqs: ["Captain America: Civil War", "Thor: Ragnarok"],
  },
  {
    title: "Avengers: Endgame",
    releaseYear: 2019,
    runtimeMinutes: 181,
    prereqs: ["Avengers: Infinity War"],
  },
  {
    title: "Avengers: Doomsday",
    releaseYear: 2026,
    runtimeMinutes: 150,
    prereqs: ["Avengers: Endgame"],
  },
];
