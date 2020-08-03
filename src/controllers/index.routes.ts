import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multerConfig';
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
import { autenticarConsumidor, autenticarFornecedor } from './sessaoController';
import { listaArquivosFornecedor } from './arquivoController';
import {
  authMiddlewareFornecedor,
  authMiddlewareConsumidor,
} from '../middlewares/authMiddleware';
import {
  solicitarPedido,
  listarPedidosConsumidor,
  validarPedidos,
  listarPedidosFornecedor,
  historicoFornecedor,
} from './reservaController';
import { detalhesPedidoFornecedor } from './pedidoController';

const routes = Router();

// Fornecedor
routes.post(
  '/fornecedor',
  multer(multerConfig).array('file', 5),
  cadastrarFornecedor,
);
routes.put('/validarpedidos/:id', authMiddlewareFornecedor, validarPedidos);
routes.put('/fornecedor/:id', atualizarFornecedor);
routes.get(
  '/fornecedor/pedidos',
  authMiddlewareFornecedor,
  listarPedidosFornecedor,
);
routes.get(
  '/fornecedor/pedidos/itens/:id',
  authMiddlewareFornecedor,
  detalhesPedidoFornecedor,
);
routes.get(
  '/fornecedor/pedidos/historico',
  authMiddlewareFornecedor,
  historicoFornecedor,
);
routes.get('/fornecedor', listarTodosFornecedores);
routes.get('/dashboard/fornecedor', listarForneceodresNaoVerificados);
routes.get('/fornecedor/:id', listarFornecedor);
routes.delete('/fornecedor', authMiddlewareFornecedor, deletarFornecedor);

// Produto
routes.post(
  '/produto',
  authMiddlewareFornecedor,
  multer(multerConfig).array('file', 4),
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

// Arquivos
routes.get(
  '/arquivofornecedor',
  authMiddlewareFornecedor,
  listaArquivosFornecedor,
);

export default routes;
