import { Types } from "mongoose";

export interface IMovie {
    _id?: Types.ObjectId | string;
    title: string;
    releaseYear: number;
    runtimeMinutes: number;
    prerequisites: (Types.ObjectId | string)[];
    watched: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateMovieInput {
    title: string;
    releaseYear: number;
    runtimeMinutes: number;
    prerequisites?: string[];
    watched?: boolean;
}

export interface IUpdateMovieInput {
    title?: string;
    releaseYear?: number;
    runtimeMinutes?: number;
    prerequisites?: string[];
    watched?: boolean;
}

export interface IMovieNode {
    _id: string;
    title: string;
    releaseYear: number;
    runtimeMinutes: number;
    prerequisites: string[];
    watched: boolean;
}

export interface IRewatchOrderResult {
    target: IMovieNode;
    order: IMovieNode[];
    watchedCount: number;
    totalCount: number;
    unwatchedRuntimeMinutes: number;
}
