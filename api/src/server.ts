import 'dotenv/config';
import './db';
import app from './app';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
