import assert from "node:assert/strict";
import { IMovieNode } from "../src/app/modules/movie/movie.interface";
import { computeRewatchOrder, wouldCreateCycle } from "../src/app/modules/movie/movie.logic";
import { calculateBookingQuote } from "../src/app/modules/cinema/cinema.logic";

// --- Feature 1 Tests: Movies & Rewatch Order ---
const movies: IMovieNode[] = [
    { _id: "1", title: "Iron Man", releaseYear: 2008, runtimeMinutes: 126, prerequisites: [], watched: true },
    { _id: "2", title: "Captain America: The First Avenger", releaseYear: 2011, runtimeMinutes: 124, prerequisites: [], watched: false },
    { _id: "3", title: "The Avengers", releaseYear: 2012, runtimeMinutes: 143, prerequisites: ["1", "2"], watched: true },
    { _id: "4", title: "Captain America: Civil War", releaseYear: 2016, runtimeMinutes: 147, prerequisites: ["3"], watched: false },
    { _id: "5", title: "Thor: Ragnarok", releaseYear: 2017, runtimeMinutes: 130, prerequisites: [], watched: false },
    { _id: "6", title: "Avengers: Infinity War", releaseYear: 2018, runtimeMinutes: 149, prerequisites: ["4", "5"], watched: false },
    { _id: "7", title: "Avengers: Endgame", releaseYear: 2019, runtimeMinutes: 181, prerequisites: ["6"], watched: false },
    { _id: "8", title: "Avengers: Doomsday", releaseYear: 2026, runtimeMinutes: 150, prerequisites: ["7"], watched: false },
];

const movieMap = new Map(movies.map((m) => [m._id, m]));

// 1. Rewatch order for Avengers: Doomsday (all 7 other movies, target excluded)
const doomsdayOrder = computeRewatchOrder(movieMap, "8");
assert.equal(doomsdayOrder.totalCount, 7);
assert.equal(doomsdayOrder.order.some((m) => m._id === "8"), false);
assert.equal(doomsdayOrder.watchedCount, 2); // Iron Man + The Avengers
assert.equal(doomsdayOrder.unwatchedRuntimeMinutes, 124 + 147 + 130 + 149 + 181);
const indexById = new Map(doomsdayOrder.order.map((m, idx) => [m._id, idx]));
for (const m of doomsdayOrder.order) {
    for (const prereq of m.prerequisites) {
        assert.ok(indexById.get(prereq)! < indexById.get(m._id)!, `${prereq} must appear before ${m._id}`);
    }
}

// 2. Rewatch order for Captain America: Civil War
const civilWarOrder = computeRewatchOrder(movieMap, "4");
assert.deepEqual(
    civilWarOrder.order.map((m) => m.title),
    ["Iron Man", "Captain America: The First Avenger", "The Avengers"]
);

// 3. Rewatch order for Thor: Ragnarok
const ragnarokOrder = computeRewatchOrder(movieMap, "5");
assert.equal(ragnarokOrder.totalCount, 0);
assert.deepEqual(ragnarokOrder.order, []);

// 4. Circular dependency detection: Endgame as prerequisite of Iron Man
assert.equal(wouldCreateCycle(movieMap, "1", ["7"]), true);
// Direct self-dependency
assert.equal(wouldCreateCycle(movieMap, "1", ["1"]), true);
// Valid dependency
assert.equal(wouldCreateCycle(movieMap, "5", ["3"]), false);

// --- Feature 2 Tests: Cinema Booking Quote ---
const q1 = calculateBookingQuote([1, 3, 4], 6);
assert.equal(q1.possible, true);
assert.equal(q1.totalBundles, 2);
assert.deepEqual(q1.breakdown, [{ bundleSize: 3, count: 2 }]);

const q2 = calculateBookingQuote([2, 5], 11);
assert.equal(q2.possible, true);
assert.equal(q2.totalBundles, 4);
assert.deepEqual(q2.breakdown, [
    { bundleSize: 5, count: 1 },
    { bundleSize: 2, count: 3 },
]);

const q3 = calculateBookingQuote([6, 9, 20], 44);
assert.equal(q3.possible, true);
assert.equal(q3.totalBundles, 4);
assert.deepEqual(q3.breakdown, [
    { bundleSize: 20, count: 1 },
    { bundleSize: 9, count: 2 },
    { bundleSize: 6, count: 1 },
]);

const q4 = calculateBookingQuote([4, 6], 7);
assert.equal(q4.possible, false);
assert.equal(q4.message, "Not possible");

console.log("All Feature 1 and Feature 2 logic tests passed!");
