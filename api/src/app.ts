import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Moto Care Jobs API is running' });
});
app.use('/auth', authRouter);

export default app;
