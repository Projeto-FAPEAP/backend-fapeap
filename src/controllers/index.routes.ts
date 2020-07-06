import { Router } from 'express';
import { listarTodosFornecedores } from './fornecedorController';
import {
  listarTodosConsumidores,
  cadastrarConsumidor,
} from './consumidorController';

const routes = Router();

routes.get('/fornecedor', listarTodosFornecedores);

routes.post('/consumidor', cadastrarConsumidor);
routes.get('/consumidor', listarTodosConsumidores);

export default routes;
