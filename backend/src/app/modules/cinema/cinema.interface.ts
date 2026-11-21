import { Types } from "mongoose";

export interface ICinema {
    _id?: Types.ObjectId | string;
    name: string;
    bundleSizes: number[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateCinemaInput {
    name: string;
    bundleSizes: number[];
}

export interface IBundleBreakdownItem {
    bundleSize: number;
    count: number;
}

export interface IBookingQuoteResult {
    possible: boolean;
    groupSize: number;
    totalBundles: number;
    breakdown: IBundleBreakdownItem[];
    message: string;
}
