import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CinemaService } from "./cinema.service";

const createCinema = catchAsync(async (req: Request, res: Response) => {
    const result = await CinemaService.createCinema(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Cinema created successfully",
        data: result,
    });
});

const getAllCinemas = catchAsync(async (_req: Request, res: Response) => {
    const result = await CinemaService.getAllCinemas();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cinemas retrieved successfully",
        data: result,
    });
});

const getBookingQuote = catchAsync(async (req: Request, res: Response) => {
    const groupSize = Number(req.query.groupSize);
    const result = await CinemaService.getBookingQuote(
        req.params.id as string,
        groupSize
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: result.message,
        data: result,
    });
});

export const CinemaController = {
    createCinema,
    getAllCinemas,
    getBookingQuote,
};
