import express from 'express';


import { PORT,FRONTEND_URL } from './config/config.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';

// import middlewares
import errorMiddleware from './middlewares/error.middleware.js';
import authMiddleware from './middlewares/auth.middleware.js';

// import routes
import authRouter from './routes/auth.router.js';
import userRouter from './routes/user.router.js';
import postRouter from './routes/post.router.js';
import homeRouter from './routes/home.router.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));


// API routes
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/users', authMiddleware, userRouter);
app.use('/posts', authMiddleware,postRouter);

// Error Middleware
app.use(errorMiddleware);


app.listen( PORT, ()=>{
    console.log(`Server running of port ${PORT}`)
});


//Handle unhandled promise rejections (e.g. database connection errors)
process.on("unhandledRejection",  (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    Server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    await disconnectDB();
    process.exit(1);
});

//Greaceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    await disconnectDB();
    process.exit(0);
});