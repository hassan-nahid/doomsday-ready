import { model, Schema } from "mongoose";
import { ICinema } from "./cinema.interface";

const cinemaSchema = new Schema<ICinema>(
    {
        name: {
            type: String,
            required: [true, "Cinema name is required"],
            unique: true,
            trim: true,
        },
        bundleSizes: {
            type: [Number],
            required: [true, "Bundle sizes are required"],
            validate: [
                {
                    validator: (arr: number[]) => arr.length >= 1 && arr.length <= 10,
                    message: "A cinema must have between 1 and 10 bundle sizes",
                },
                {
                    validator: (arr: number[]) =>
                        arr.every((n) => Number.isInteger(n) && n >= 1 && n <= 500),
                    message: "Each bundle size must be an integer between 1 and 500",
                },
            ],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Cinema = model<ICinema>("Cinema", cinemaSchema);
