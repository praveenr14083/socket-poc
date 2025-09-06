import express from "express";
import corsMiddleware from "./middleware/cors.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

export default app;
