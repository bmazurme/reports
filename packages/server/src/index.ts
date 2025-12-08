
import express, { Request, Response } from 'express';
import cors from 'cors';
import { handleCounts } from './counts/handler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/counts', handleCounts);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
});

app.listen(port, () => {
  console.log(`🚀 The server is running at http://localhost:${port}`);
});
