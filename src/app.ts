import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";

const app = express();
app.use(bodyParser.json());
app.use("/users", userRoutes);
app.use("/sessions", sessionRoutes);

export default app;
