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
import { authMiddlewareFornecedor } from '../middlewares/authMiddleware';

const routes = Router();

// Fornecedor
routes.post(
  '/fornecedor',
  multer(multerConfig).fields([
    { name: 'imagens', maxCount: 4 },
    { name: 'video', maxCount: 1 },
  ]),
  cadastrarFornecedor,
);
routes.get('/fornecedor', listarTodosFornecedores);
routes.get('/fornecedor', listarFornecedor);
routes.delete('/fornecedor', autenticarFornecedor, deletarFornecedor);

// Produto
routes.post('/produto', authMiddlewareFornecedor, cadastrarProduto);
routes.get('/produto', authMiddlewareFornecedor, listarProdutos);
routes.get('/produto', authMiddlewareFornecedor, listarProduto);
routes.delete('/produto', authMiddlewareFornecedor, deletarProduto);

// Consumidor
routes.post('/consumidor', cadastrarConsumidor);
routes.get('/consumidor', listarTodosConsumidores);
routes.get('/consumidor', listarConsumidor);
routes.delete('/consumidor', autenticarConsumidor, deletarConsumidor);

// Sessao - Login
routes.post('/sessao/consumidor', autenticarConsumidor);
routes.post('/sessao/fornecedor', autenticarFornecedor);

export default routes;
