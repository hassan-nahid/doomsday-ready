import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { MovieController } from "./movie.controller";
import {
    createMovieZodSchema,
    movieIdParamZodSchema,
    updateMovieZodSchema,
} from "./movie.validation";

const router = Router();

router.post("/", validateRequest(createMovieZodSchema), MovieController.createMovie);
router.get("/", MovieController.getAllMovies);
router.patch("/:id", validateRequest(updateMovieZodSchema), MovieController.updateMovie);
router.get(
    "/:id/rewatch-order",
    validateRequest(movieIdParamZodSchema),
    MovieController.getRewatchOrder
);

export const MovieRoutes = router;
