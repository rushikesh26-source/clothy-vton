import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { db } from "./db";
// Load environment variables from the monorepo root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
const port = process.env.API_PORT || 4000;

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "clothy-api",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`[Clothy API] Server running on http://localhost:${port}`);
});