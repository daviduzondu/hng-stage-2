import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config.js';
import authRouter from './routes/auth.route.js';

const app: Express = express();
const port: number = Number(process.env.PORT) || 2000;
app.use(bodyParser.json());


app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server!");
});

// Auth router
app.use('/auth', authRouter);

// Global error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    res.status(500).json({ error: true, message: err.message });
});

app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}.`);
});
