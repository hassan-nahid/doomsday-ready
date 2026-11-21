import { z } from "zod";

const objectIdString = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid cinema ID format");

export const createCinemaZodSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1, "Cinema name is required"),
        bundleSizes: z
            .array(z.number().int().min(1).max(500))
            .min(1, "At least 1 bundle size is required")
            .max(10, "At most 10 bundle sizes are allowed")
            .refine((sizes) => new Set(sizes).size === sizes.length, {
                message: "Bundle sizes must be unique",
            }),
    }),
});

export const bookingQuoteZodSchema = z.object({
    params: z.object({
        id: objectIdString,
    }),
    query: z.object({
        groupSize: z.coerce
            .number()
            .int("groupSize must be an integer")
            .min(1, "groupSize must be at least 1")
            .max(10000, "groupSize cannot exceed 10000"),
    }),
});
