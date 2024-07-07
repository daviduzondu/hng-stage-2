import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import organisationRouter from './routes/organisation.route.js';
import { pick } from './utils/pick.js';
import * as client from './db/index.js';
import { readFile } from 'fs/promises';
import path from 'path';

// @ts-ignore
const app: Express = express();
const port: number = Number(process.env.PORT) || 3030;
app.use(bodyParser.json());
app.use(cors());

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

async function checkDB() {
    try {
        (await client.query('SELECT * from users', [])).rowCount
    } catch (error: any) {
        if (error.code === '42P01') {
            const sql = await readFile(path.resolve("./src/db/setup.sql"), { "encoding": "utf-8" });
            const res = await client.query(sql, []);
        } else throw(error);
    }

}

app.listen(port, async () => {
    try {
        await checkDB();
    } catch (error: any) {
        console.log(`Unable to communicate with database`);
        console.log(error);
        process.exit(1);
    }
    console.log(`[server]: Server is running at http://localhost:${port}.`);
});

export { app };