import { model, Schema } from "mongoose";
import { IMovie } from "./movie.interface";

const movieSchema = new Schema<IMovie>(
    {
        title: {
            type: String,
            required: [true, "Movie title is required"],
            unique: true,
            trim: true,
        },
        releaseYear: {
            type: Number,
            required: [true, "Release year is required"],
            min: [1888, "Release year must be 1888 or later"],
            max: [2100, "Release year must be 2100 or earlier"],
        },
        runtimeMinutes: {
            type: Number,
            required: [true, "Runtime in minutes is required"],
            min: [1, "Runtime must be at least 1 minute"],
            max: [300, "Runtime cannot exceed 300 minutes"],
        },
        prerequisites: [
            {
                type: Schema.Types.ObjectId,
                ref: "Movie",
            },
        ],
        watched: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Movie = model<IMovie>("Movie", movieSchema);
