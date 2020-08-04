import { Router } from 'express';
import multer from 'multer';
import { awsStorageFiles } from '../config/multerConfig';

import {
  cadastrarFornecedor,
  listarTodosFornecedores,
  listarFornecedor,
  deletarFornecedor,
  atualizarFornecedor,
} from './fornecedorController';
import { listarForneceodresNaoVerificados } from './validacaoFornecedor';
import {
  cadastrarConsumidor,
  listarTodosConsumidores,
  listarConsumidor,
  deletarConsumidor,
  avalicaoFornecedor,
} from './consumidorController';
import {
  cadastrarProduto,
  listarProdutos,
  listarProduto,
  atualizarProduto,
  deletarProduto,
} from './produtoController';
import {
  autenticarConsumidor,
  autenticarFornecedor,
  autenticarAdmin,
} from './sessaoController';
import { listaArquivosFornecedor } from './arquivoController';
import {
  authMiddlewareFornecedor,
  authMiddlewareConsumidor,
  authMiddlewareAdmin,
} from '../middlewares/authMiddleware';
import {
  solicitarPedido,
  listarPedidosConsumidor,
  validarPedidos,
  listarPedidosFornecedor,
  historicoFornecedor,
} from './reservaController';
import { listarDetalhesPedidoFornecedor } from './pedidoController';

const routes = Router();

// Fornecedor
routes.post(
  '/fornecedor',
  awsStorageFiles.array('file', 5),
  cadastrarFornecedor,
);
routes.put('/validarpedidos/:id', authMiddlewareFornecedor, validarPedidos);
routes.get(
  '/fornecedor/pedidos',
  authMiddlewareFornecedor,
  listarPedidosFornecedor,
);
routes.get(
  '/fornecedor/pedidos/itens/:id',
  authMiddlewareFornecedor,
  listarDetalhesPedidoFornecedor,
);
routes.get(
  '/fornecedor/pedidos/historico',
  authMiddlewareFornecedor,
  historicoFornecedor,
);
routes.get('/fornecedor', listarTodosFornecedores);
routes.get('/fornecedor/:id', listarFornecedor);
routes.delete('/fornecedor', authMiddlewareFornecedor, deletarFornecedor);

// Produto
routes.post(
  '/produto',
  authMiddlewareFornecedor,
  awsStorageFiles.array('file', 4),
  cadastrarProduto,
);
routes.get('/produto/:idfornecedor', listarProdutos);
routes.get('/produto/:idfornecedor/:idproduto', listarProduto);
routes.put('/produto/:id', authMiddlewareFornecedor, atualizarProduto);
routes.delete('/produto/:id', authMiddlewareFornecedor, deletarProduto);

// Consumidor
routes.post('/consumidor', cadastrarConsumidor);
routes.post(
  '/consumidor/:id/:compra',
  authMiddlewareConsumidor,
  solicitarPedido,
);
routes.post('/avaliacao/:id', authMiddlewareConsumidor, avalicaoFornecedor);
routes.get('/consumidor', listarTodosConsumidores);
routes.get('/consumidor/:id', listarConsumidor);
routes.delete('/consumidor', authMiddlewareConsumidor, deletarConsumidor);
routes.get('/listapedidos', authMiddlewareConsumidor, listarPedidosConsumidor);

// Sessao - Login
routes.post('/sessao/consumidor', autenticarConsumidor);
routes.post('/sessao/fornecedor', autenticarFornecedor);
routes.post('/sessao/admin', autenticarAdmin);

// Arquivos
routes.get(
  '/arquivofornecedor',
  authMiddlewareFornecedor,
  listaArquivosFornecedor,
);

// Admin
routes.get(
  '/dashboard/fornecedor',
  authMiddlewareAdmin,
  listarForneceodresNaoVerificados,
);
routes.put(
  '/dashboard/fornecedor/:id',
  authMiddlewareAdmin,
  atualizarFornecedor,
);

export default routes;
