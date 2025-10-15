import express from "express";
import dotenv from "dotenv";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/companies", companyRoutes);

export default app;
