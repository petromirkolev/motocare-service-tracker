import 'dotenv/config';
import app from './app';
import { initDb } from './init-db';

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
