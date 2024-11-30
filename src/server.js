import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
// import pino from 'pino-http';

import { env } from './utils/env.js';

import contactsRouter from './routers/contacts.js';
import authRouter from "./routers/auth.js";


import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerDocs } from "./middlewares/swaggerDocs.js";
import { logger } from './middlewares/logger.js';

export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static("uploads"));

 app.use(logger);

  app.use("/auth", authRouter);
  app.use('/contacts', contactsRouter);
  app.use("/api-docs", swaggerDocs());
  
  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(env('PORT', 3000));

  app.listen(port, () => console.log(`Server running on ${port} PORT`));
};
