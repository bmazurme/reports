
import express, { Request, Response } from 'express';
import cors from 'cors';

import { handleCounts, handleAddOffDay, handleRemoveOffDay } from './counts/handler';
import { handleReport } from './reports/handler';
import { handleGetSettings, handleSetSettings } from './settings/handler';
import { handleGetProjectDict, handleAddProjectCode, handleRemoveProjectCode } from './reports/project-dict-handler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/counts/:id', handleCounts);
app.post('/api/counts/:id/off-days', handleAddOffDay);
app.delete('/api/counts/:id/off-days/:date', handleRemoveOffDay);
app.get('/api/reports', handleReport);
app.get('/api/settings', handleGetSettings);
app.post('/api/settings', handleSetSettings);
app.get('/api/project-dict', handleGetProjectDict);
app.post('/api/project-dict', handleAddProjectCode);
app.delete('/api/project-dict/:code', handleRemoveProjectCode);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
});

app.listen(port, () => {
  console.log(`🚀 The server is running at http://localhost:${port}`);
});
