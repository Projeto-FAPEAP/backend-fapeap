import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multerConfig';
import {
  listarTodosFornecedores,
  cadastrarFornecedor,
} from './fornecedorController';
import { cadastrarConsumidor } from './consumidorController';
import { autenticaConsumidor, autenticaFornecedor } from './sessaoController';
import { authMiddlewareConsumidor } from '../middlewares/authMiddleware';

const routes = Router();
// Fornecedor
routes.post(
  '/fornecedor',
  multer(multerConfig).fields([
    { name: 'imagem', maxCount: 4 },
    { name: 'video', maxCount: 1 },
  ]),
  cadastrarFornecedor,
);

routes.get('/fornecedor', authMiddlewareConsumidor, listarTodosFornecedores);
// Consumidor
routes.post('/consumidor', cadastrarConsumidor);
// Sessao
routes.post('/sessao/consumidor', autenticaConsumidor);
routes.post('/sessao/fornecedor', autenticaFornecedor);

export default routes;
