import cors from 'cors';
import express from 'express';
import { router } from './routes';

const app = express();
const port = Number(process.env['PORT'] ?? '3000');

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log('authentication API listening on port ' + port);
});
