import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1); // Render এর প্রক্সির পিছনে সঠিক IP পেতে
app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      // origin না থাকলে (curl/Postman/সার্ভার-টু-সার্ভার) অনুমতি; থাকলে তালিকায় থাকতে হবে
      if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
      cb(new Error('এই ওয়েবসাইটকে API ব্যবহারের অনুমতি নেই (CORS)।'));
    },
  })
);
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
