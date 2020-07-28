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
  atualizarProduto,
  deletarProduto,
} from './produtoController';
import { autenticarConsumidor, autenticarFornecedor } from './sessaoController';
import { listaArquivosFornecedor } from './arquivoController';
import {
  authMiddlewareFornecedor,
  authMiddlewareConsumidor,
} from '../middlewares/authMiddleware';
import { reservarProduto } from './reservaController';

const routes = Router();

// Fornecedor
routes.post(
  '/fornecedor',
  multer(multerConfig).array('file', 5),
  cadastrarFornecedor,
);
routes.get('/fornecedor', listarTodosFornecedores);
routes.get('/fornecedor/:id', listarFornecedor);
routes.delete('/fornecedor', authMiddlewareFornecedor, deletarFornecedor);

// Produto
routes.post(
  '/produto',
  authMiddlewareFornecedor,
  multer(multerConfig).array('file', 4),
  cadastrarProduto,
);
routes.get('/produto', authMiddlewareFornecedor, listarProdutos);
routes.get('/produto/:id', authMiddlewareFornecedor, listarProduto);
routes.put('/produto/:id', authMiddlewareFornecedor, atualizarProduto);
routes.delete('/produto/:id', authMiddlewareFornecedor, deletarProduto);

// Consumidor
routes.post('/consumidor', cadastrarConsumidor);
routes.post('/consumidor/:id/:qntd', authMiddlewareConsumidor, reservarProduto);
routes.get('/consumidor', listarTodosConsumidores);
routes.get('/consumidor/:id', listarConsumidor);
routes.delete('/consumidor', authMiddlewareConsumidor, deletarConsumidor);

// Sessao - Login
routes.post('/sessao/consumidor', autenticarConsumidor);
routes.post('/sessao/fornecedor', autenticarFornecedor);

// Arquivos
routes.get(
  '/arquivofornecedor',
  authMiddlewareFornecedor,
  listaArquivosFornecedor,
);

export default routes;
