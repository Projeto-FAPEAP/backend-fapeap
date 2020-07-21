/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './controllers/index.routes';
import './database';

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(routes);

dotenv.config();

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server rodando ⚡`);
});
