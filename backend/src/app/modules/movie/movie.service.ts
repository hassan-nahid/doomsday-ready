import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import {
    ICreateMovieInput,
    IMovieNode,
    IRewatchOrderResult,
    IUpdateMovieInput,
} from "./movie.interface";
import { computeRewatchOrder, wouldCreateCycle } from "./movie.logic";
import { Movie } from "./movie.model";

const toMovieNode = (doc: {
    _id: unknown;
    title: string;
    releaseYear: number;
    runtimeMinutes: number;
    prerequisites?: unknown[];
    watched?: boolean;
}): IMovieNode => ({
    _id: String(doc._id),
    title: doc.title,
    releaseYear: doc.releaseYear,
    runtimeMinutes: doc.runtimeMinutes,
    prerequisites: (doc.prerequisites ?? []).map((id) => String(id)),
    watched: Boolean(doc.watched),
});

const loadMovieMap = async (): Promise<Map<string, IMovieNode>> => {
    const docs = await Movie.find().lean();
    const movieMap = new Map<string, IMovieNode>();
    for (const doc of docs) {
        const node = toMovieNode(doc);
        movieMap.set(node._id, node);
    }
    return movieMap;
};

const ensurePrerequisitesExist = (
    movieMap: Map<string, IMovieNode>,
    prerequisiteIds: string[]
) => {
    for (const prereqId of prerequisiteIds) {
        if (!movieMap.has(prereqId)) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                `Prerequisite movie with id ${prereqId} not found`
            );
        }
    }
};

const createMovie = async (payload: ICreateMovieInput) => {
    const uniquePrereqs = Array.from(new Set(payload.prerequisites ?? []));

    if (uniquePrereqs.length > 0) {
        const movieMap = await loadMovieMap();
        ensurePrerequisitesExist(movieMap, uniquePrereqs);
    }

    const movie = await Movie.create({
        ...payload,
        prerequisites: uniquePrereqs,
    });

    return movie.populate("prerequisites", "title releaseYear runtimeMinutes watched");
};

const getAllMovies = async () => {
    return Movie.find()
        .populate("prerequisites", "title releaseYear runtimeMinutes watched")
        .sort({ releaseYear: 1, title: 1 });
};

const updateMovie = async (id: string, payload: IUpdateMovieInput) => {
    const movieMap = await loadMovieMap();
    if (!movieMap.has(id)) {
        throw new AppError(StatusCodes.NOT_FOUND, "Movie not found");
    }

    const updateData: IUpdateMovieInput = { ...payload };

    if (payload.prerequisites !== undefined) {
        const uniquePrereqs = Array.from(new Set(payload.prerequisites));
        ensurePrerequisitesExist(movieMap, uniquePrereqs);

        if (wouldCreateCycle(movieMap, id, uniquePrereqs)) {
            throw new AppError(
                StatusCodes.CONFLICT,
                "Circular dependency detected: a movie cannot depend on itself directly or indirectly",
                "CIRCULAR_DEPENDENCY"
            );
        }

        updateData.prerequisites = uniquePrereqs;
    }

    const updated = await Movie.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate("prerequisites", "title releaseYear runtimeMinutes watched");

    if (!updated) {
        throw new AppError(StatusCodes.NOT_FOUND, "Movie not found");
    }

    return updated;
};

const getRewatchOrder = async (id: string): Promise<IRewatchOrderResult> => {
    const movieMap = await loadMovieMap();
    if (!movieMap.has(id)) {
        throw new AppError(StatusCodes.NOT_FOUND, "Movie not found");
    }

    return computeRewatchOrder(movieMap, id);
};

export const MovieService = {
    createMovie,
    getAllMovies,
    updateMovie,
    getRewatchOrder,
};
