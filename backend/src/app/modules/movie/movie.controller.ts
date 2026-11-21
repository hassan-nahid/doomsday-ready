import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { MovieService } from "./movie.service";

const createMovie = catchAsync(async (req: Request, res: Response) => {
    const result = await MovieService.createMovie(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Movie created successfully",
        data: result,
    });
});

const getAllMovies = catchAsync(async (_req: Request, res: Response) => {
    const result = await MovieService.getAllMovies();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Movies retrieved successfully",
        data: result,
    });
});

const updateMovie = catchAsync(async (req: Request, res: Response) => {
    const result = await MovieService.updateMovie(req.params.id as string, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Movie updated successfully",
        data: result,
    });
});

const getRewatchOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await MovieService.getRewatchOrder(req.params.id as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Rewatch order calculated successfully",
        data: result,
    });
});

export const MovieController = {
    createMovie,
    getAllMovies,
    updateMovie,
    getRewatchOrder,
};
