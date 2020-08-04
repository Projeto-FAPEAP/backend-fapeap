import { Router } from 'express';
import { awsStorageFiles } from '../config/multerConfig';

import FornecedorController from './fornecedorController';
import ConsumidorController from './consumidorController';
import DashboardController from './dashboardController';
import ProdutoController from './produtoController';
import SessaoController from './sessaoController';
import ArquivoController from './arquivoController';
import AuthController from '../middlewares/authMiddleware';
import PedidoConsumidor from './pedidoConsumidorController';
import PedidoFornecedor from './pedidoFornecedorController';

const routes = Router();

// Fornecedor
routes.post(
  '/fornecedor',
  awsStorageFiles.array('file', 5),
  FornecedorController.cadastrarFornecedor,
);
routes.put(
  '/validarpedidos/:id',
  AuthController.fornecedor,
  PedidoFornecedor.validarPedidos,
);
routes.get(
  '/fornecedor/pedidos',
  AuthController.fornecedor,
  PedidoFornecedor.listarPedidosFornecedor,
);
routes.get(
  '/fornecedor/pedidos/itens/:id',
  AuthController.fornecedor,
  PedidoFornecedor.listarDetalhesPedidoFornecedor,
);
routes.get(
  '/fornecedor/pedidos/historico',
  AuthController.fornecedor,
  PedidoFornecedor.historicoFornecedor,
);
routes.get('/fornecedor', FornecedorController.listarTodosFornecedores);
routes.get('/fornecedor/:id', FornecedorController.listarFornecedor);
routes.delete(
  '/fornecedor',
  AuthController.fornecedor,
  FornecedorController.deletarFornecedor,
);

// Produto
routes.post(
  '/produto',
  AuthController.fornecedor,
  awsStorageFiles.array('file', 4),
  ProdutoController.cadastrarProduto,
);
routes.get('/produto/:idfornecedor', ProdutoController.listarProdutos);
routes.get(
  '/produto/:idfornecedor/:idproduto',
  ProdutoController.listarProduto,
);
routes.put(
  '/produto/:id',
  AuthController.fornecedor,
  ProdutoController.atualizarProduto,
);
routes.delete(
  '/produto/:id',
  AuthController.fornecedor,
  ProdutoController.deletarProduto,
);

// Consumidor
routes.post('/consumidor', ConsumidorController.cadastrarConsumidor);
routes.post(
  '/consumidor/:id/:compra',
  AuthController.consumidor,
  PedidoConsumidor.solicitarPedido,
);
routes.post(
  '/avaliacao/:id',
  AuthController.consumidor,
  ConsumidorController.avaliarFornecedor,
);
routes.get('/consumidor', ConsumidorController.listarTodosConsumidores);
routes.get('/consumidor/:id', ConsumidorController.listarConsumidor);
routes.delete(
  '/consumidor',
  AuthController.consumidor,
  ConsumidorController.deletarConsumidor,
);
routes.get(
  '/listapedidos',
  AuthController.consumidor,
  PedidoConsumidor.listarPedidosConsumidor,
);

// Sessao - Login
routes.post('/sessao/consumidor', SessaoController.autenticarConsumidor);
routes.post('/sessao/fornecedor', SessaoController.autenticarFornecedor);
routes.post('/sessao/admin', SessaoController.autenticarAdmin);

// Arquivos
routes.get(
  '/arquivofornecedor',
  AuthController.fornecedor,
  ArquivoController.listaArquivosFornecedor,
);

// Dashboard - Admin
routes.get(
  '/dashboard/fornecedor',
  AuthController.admin,
  DashboardController.listarForneceodresNaoVerificados,
);
routes.put(
  '/dashboard/fornecedor/:id',
  AuthController.admin,
  DashboardController.validarFornecedor,
);

export default routes;
