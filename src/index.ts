import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import organisationRouter from './routes/organisation.route.js';
import { pick } from './utils/pick.js';

const app: Express = express();
const port: number = Number(process.env.PORT) || 2000;
app.use(bodyParser.json());


app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server!");
});

// Auth router
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/organisations', organisationRouter);

// Global error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    // @ts-ignore
    res.status(err.statusCode || 500).json({ status: err.name, ...pick(err, Object.keys(err).filter(x => x !== 'name')) });
});

app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}.`);
});
