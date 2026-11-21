import { Router } from "express";
import { MovieRoutes } from "../modules/movie/movie.route";
import { CinemaRoutes } from "../modules/cinema/cinema.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/movies",
        route: MovieRoutes
    },
    {
        path: "/cinemas",
        route: CinemaRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})