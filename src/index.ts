import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config.js';
// import { router as greeting } from "./routes/greet";
const app: Express = express();
const port: number = Number(process.env.PORT) || 2000;
const API_KEY = process.env.API_KEY
app.set('trust proxy', true);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server!");
});

// Global error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    res.status(500).json({ error: true, message: err.message });
});

app.listen(port, () => console.log(`[server]: Server is running at http://localhost:${port}`));