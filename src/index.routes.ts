import { Router } from 'express';
import { awsStorageFiles } from './config/multerConfig';

import FornecedorController from './controllers/fornecedorController';
import ConsumidorController from './controllers/consumidorController';
import DashboardController from './controllers/dashboardController';
import ProdutoController from './controllers/produtoController';
import SessaoController from './controllers/sessaoController';
import ArquivoController from './controllers/arquivoController';
import AuthMiddleware from './middlewares/authMiddleware';
import PedidoConsumidor from './controllers/pedidoConsumidorController';
import PedidoFornecedor from './controllers/pedidoFornecedorController';

const routes = Router();

// Fornecedor
routes.post(
  '/fornecedor',
  awsStorageFiles.array('file', 5),
  FornecedorController.cadastrarFornecedor,
);
routes.put(
  '/validarpedidos/:id',
  AuthMiddleware.fornecedor,
  PedidoFornecedor.validarPedidos,
);
routes.put(
  '/cancelarpedidos/:id',
  AuthMiddleware.fornecedor,
  PedidoFornecedor.cancelarPedido,
);
routes.get(
  '/fornecedor/pedidos',
  AuthMiddleware.fornecedor,
  PedidoFornecedor.listarPedidosFornecedor,
);
routes.get(
  '/fornecedor/pedidos/itens/:id',
  AuthMiddleware.fornecedor,
  PedidoFornecedor.listarDetalhesPedidoFornecedor,
);
routes.get(
  '/fornecedor/pedidos/historico',
  AuthMiddleware.fornecedor,
  PedidoFornecedor.historicoFornecedor,
);
routes.get('/fornecedor', FornecedorController.listarTodosFornecedores);
routes.get('/fornecedor/:id', FornecedorController.listarFornecedor);
routes.delete(
  '/fornecedor',
  AuthMiddleware.fornecedor,
  FornecedorController.deletarFornecedor,
);

// Produto
routes.post(
  '/produto',
  AuthMiddleware.fornecedor,
  awsStorageFiles.array('file', 4),
  ProdutoController.cadastrarProduto,
);
routes.post(
  '/arquivoproduto/:id',
  AuthMiddleware.fornecedor,
  awsStorageFiles.array('file', 4),
  ProdutoController.adicionarArqProduto,
);
routes.get('/produto/:idfornecedor', ProdutoController.listarProdutos);
routes.get(
  '/produto/:idfornecedor/:idproduto',
  ProdutoController.listarProduto,
);
routes.put(
  '/produto/:id',
  AuthMiddleware.fornecedor,
  ProdutoController.atualizarProduto,
);
routes.put(
  '/arquivoproduto/:id',
  AuthMiddleware.fornecedor,
  ProdutoController.atualizarArqProduto,
);
routes.delete(
  '/produto/:id',
  AuthMiddleware.fornecedor,
  ProdutoController.deletarProduto,
);
routes.delete(
  '/arquivoproduto/:id',
  AuthMiddleware.fornecedor,
  ProdutoController.deletarArqProduto,
);

// Consumidor
routes.post('/consumidor', ConsumidorController.cadastrarConsumidor);
routes.post(
  '/consumidor/:id/:compra',
  AuthMiddleware.consumidor,
  PedidoConsumidor.solicitarPedido,
);
routes.post(
  '/avaliacao/:id',
  AuthMiddleware.consumidor,
  ConsumidorController.avaliarFornecedor,
);
routes.put(
  '/consumidor/:id',
  AuthMiddleware.consumidor,
  ConsumidorController.atualizarConsumidor,
);
routes.get('/consumidor', ConsumidorController.listarTodosConsumidores);
routes.get('/consumidor/:id', ConsumidorController.listarConsumidor);
routes.delete(
  '/consumidor',
  AuthMiddleware.consumidor,
  ConsumidorController.deletarConsumidor,
);
routes.get(
  '/listapedidos',
  AuthMiddleware.consumidor,
  PedidoConsumidor.listarPedidosConsumidor,
);

// Sessao - Login
routes.post('/sessao/consumidor', SessaoController.autenticarConsumidor);
routes.post('/sessao/fornecedor', SessaoController.autenticarFornecedor);
routes.post('/sessao/admin', SessaoController.autenticarAdmin);

// Arquivos
routes.get(
  '/arquivofornecedor',
  AuthMiddleware.fornecedor,
  ArquivoController.listaArquivosFornecedor,
);

// Dashboard - Admin
routes.get(
  '/dashboard/fornecedor',
  AuthMiddleware.admin,
  DashboardController.listarForneceodresNaoVerificados,
);
routes.put(
  '/dashboard/fornecedor/:id',
  AuthMiddleware.admin,
  DashboardController.validarFornecedor,
);

export default routes;
