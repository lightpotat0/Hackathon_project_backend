import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./middlewares/auth.js";
import cors from "cors";


dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", authRoutes);

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});