import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IBookingQuoteResult, ICreateCinemaInput } from "./cinema.interface";
import { calculateBookingQuote } from "./cinema.logic";
import { Cinema } from "./cinema.model";

const createCinema = async (payload: ICreateCinemaInput) => {
    const uniqueSizes = Array.from(new Set(payload.bundleSizes)).sort((a, b) => a - b);
    return Cinema.create({
        name: payload.name,
        bundleSizes: uniqueSizes,
    });
};

const getAllCinemas = async () => {
    return Cinema.find().sort({ name: 1 });
};

const getBookingQuote = async (
    cinemaId: string,
    groupSize: number
): Promise<IBookingQuoteResult> => {
    const cinema = await Cinema.findById(cinemaId).lean();
    if (!cinema) {
        throw new AppError(StatusCodes.NOT_FOUND, "Cinema not found");
    }

    return calculateBookingQuote(cinema.bundleSizes, groupSize);
};

export const CinemaService = {
    createCinema,
    getAllCinemas,
    getBookingQuote,
};
