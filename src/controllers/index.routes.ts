import { Router } from 'express';
import { listarTodosFornecedores } from './fornecedorController';
import { listarTodosConsumidores } from './consumidorController';

const routes = Router();

routes.get('/fornecedor', listarTodosFornecedores);
routes.get('/consumidor', listarTodosConsumidores);

export default routes;
