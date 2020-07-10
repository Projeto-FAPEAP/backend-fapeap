import { Router } from 'express';
import {
  listarTodosFornecedores,
  cadastrarFornecedor,
} from './fornecedorController';
import { cadastrarConsumidor } from './consumidorController';
import { autenticaConsumidor, autenticaFornecedor } from './sessaoController';
import { authMiddlewareConsumidor } from '../middlewares/authMiddleware';

const routes = Router();
// Fornecedor
routes.post('/fornecedor', cadastrarFornecedor);
routes.get('/fornecedor', authMiddlewareConsumidor, listarTodosFornecedores);
// Consumidor
routes.post('/consumidor', cadastrarConsumidor);
// Sessao
routes.post('/sessao/consumidor', autenticaConsumidor);
routes.post('/sessao/fornecedor', autenticaFornecedor);

export default routes;
