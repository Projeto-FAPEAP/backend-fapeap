/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './controllers/index.routes';
import './database';

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

dotenv.config();

app.listen(PORT, () => {
  console.log(`Server rodando na porta: ${PORT}! ⚡`);
});
