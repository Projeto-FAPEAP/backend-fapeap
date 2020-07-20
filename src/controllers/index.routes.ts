import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multerConfig';
import {
  cadastrarFornecedor,
  listarTodosFornecedores,
  listarFornecedor,
  deletarFornecedor,
} from './fornecedorController';
import {
  cadastrarConsumidor,
  listarTodosConsumidores,
  listarConsumidor,
  deletarConsumidor,
} from './consumidorController';
import {
  cadastrarProduto,
  listarProdutos,
  listarProduto,
  deletarProduto,
} from './produtoController';
import { autenticarConsumidor, autenticarFornecedor } from './sessaoController';
import {
  authMiddlewareFornecedor,
  authMiddlewareConsumidor,
} from '../middlewares/authMiddleware';

const routes = Router();

// Fornecedor
routes.post(
  '/fornecedor',
  multer(multerConfig).array('file'),
  cadastrarFornecedor,
);
routes.get('/fornecedor', listarTodosFornecedores);
routes.get('/fornecedor/:id', listarFornecedor);
routes.delete('/fornecedor', authMiddlewareFornecedor, deletarFornecedor);

// Produto
routes.post('/produto', authMiddlewareFornecedor, cadastrarProduto);
routes.get('/produto', authMiddlewareFornecedor, listarProdutos);
routes.get('/produto:/id', authMiddlewareFornecedor, listarProduto);
routes.delete('/produto', authMiddlewareFornecedor, deletarProduto);

// Consumidor
routes.post('/consumidor', cadastrarConsumidor);
routes.get('/consumidor', listarTodosConsumidores);
routes.get('/consumidor/:id', listarConsumidor);
routes.delete('/consumidor', authMiddlewareConsumidor, deletarConsumidor);

// Sessao - Login
routes.post('/sessao/consumidor', autenticarConsumidor);
routes.post('/sessao/fornecedor', autenticarFornecedor);

export default routes;
