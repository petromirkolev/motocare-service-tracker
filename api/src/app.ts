import express from 'express';
import cors from 'cors';
import auth_router from './routes/auth';
import bikes_router from './routes/bikes';
import jobs_router from './routes/jobs';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Moto Care Jobs API is running' });
});
app.use('/auth', auth_router);
app.use('/bikes', bikes_router);
app.use('/jobs', jobs_router);

export default app;
