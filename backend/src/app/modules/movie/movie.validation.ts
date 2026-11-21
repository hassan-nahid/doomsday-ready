import { z } from "zod";

const objectIdString = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid movie ID format");

export const createMovieZodSchema = z.object({
    body: z.object({
        title: z.string().trim().min(1, "Title is required"),
        releaseYear: z.number().int().min(1888).max(2100),
        runtimeMinutes: z.number().int().min(1).max(300),
        prerequisites: z.array(objectIdString).optional().default([]),
        watched: z.boolean().optional().default(false),
    }),
});

export const updateMovieZodSchema = z.object({
    params: z.object({
        id: objectIdString,
    }),
    body: z
        .object({
            title: z.string().trim().min(1, "Title cannot be empty").optional(),
            releaseYear: z.number().int().min(1888).max(2100).optional(),
            runtimeMinutes: z.number().int().min(1).max(300).optional(),
            prerequisites: z.array(objectIdString).optional(),
            watched: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        }),
});

export const movieIdParamZodSchema = z.object({
    params: z.object({
        id: objectIdString,
    }),
});
