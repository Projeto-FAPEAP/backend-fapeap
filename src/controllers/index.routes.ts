import { Router } from 'express';
import {
  listarTodosFornecedores,
  cadastrarFornecedor,
} from './fornecedorController';
import {
  listarTodosConsumidores,
  cadastrarConsumidor,
} from './consumidorController';

import { autenticaConsumidor, autenticaFornecedor } from './sessaoController';

const routes = Router();
// Fornecedor
routes.post('/fornecedor', cadastrarFornecedor);
routes.get('/fornecedor', listarTodosFornecedores);
// Consumidor
routes.post('/consumidor', cadastrarConsumidor);
routes.get('/consumidor', listarTodosConsumidores);
// Sessao
routes.post('/sessao/consumidor', autenticaConsumidor);
routes.post('/sessao/fornecedor', autenticaFornecedor);

export default routes;
