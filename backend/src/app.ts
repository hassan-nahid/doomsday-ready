import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";

import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("trust proxy", 1)
app.use(cors({
    origin: [envVars.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"].filter(Boolean),
    credentials: true
}))

app.use(cookieParser())

app.use("/api", router);
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app;
