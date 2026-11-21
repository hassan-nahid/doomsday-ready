import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { CinemaController } from "./cinema.controller";
import {
    bookingQuoteZodSchema,
    createCinemaZodSchema,
} from "./cinema.validation";

const router = Router();

router.post("/", validateRequest(createCinemaZodSchema), CinemaController.createCinema);
router.get("/", CinemaController.getAllCinemas);
router.get(
    "/:id/booking",
    validateRequest(bookingQuoteZodSchema),
    CinemaController.getBookingQuote
);

export const CinemaRoutes = router;
