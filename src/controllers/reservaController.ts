import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Produto from '../models/Produto';
import Pedido from '../models/Pedido';

export const reservarProduto = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const produtoRepository = getRepository(Produto);
    const { id: consumidor_id } = request.user;
    const { id } = request.params;

    const produtoASerReservado = await produtoRepository.findOne(id);

    if (!consumidor_id) {
      throw new Error('Usuário não autenticado!');
    }

    if (!produtoASerReservado) {
      throw new Error('Produto não encontrado!');
    }

    if (!produtoASerReservado.status_produto) {
      throw new Error('Produto Indisponível no momento!');
    }

    const estoque = produtoASerReservado.estoque_produto;

    const { qntd } = request.params;

    const qntd_produto = Number(qntd);

    if (estoque < qntd_produto) {
      throw new Error(`O produto possui apenas ${estoque} unidades.`);
    }

    const pedidoRepository = getRepository(Pedido);

    const total = Number(
      (produtoASerReservado.preco * qntd_produto).toFixed(2),
    );

    const status_pedido = 'Pendente';

    const { tipo_da_compra } = request.body;

    const pedidoDAO = pedidoRepository.create({
      consumidor_id,
      status_pedido,
      total,
      tipo_da_compra,
    });

    const pedido = await pedidoRepository.save(pedidoDAO);

    response.status(201).json(pedido);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

/* export const deliveryProduto = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const produtoRepository = getRepository(Produto);
    const { id: consumidor_id } = request.user;
    const { id } = request.params;

    const produtoASerEntregue = await produtoRepository.findOne(id);

    if (!consumidor_id) {
      throw new Error('Usuário não autenticado!');
    }

    if (!produtoASerEntregue) {
      throw new Error('Produto não encontrado!');
    }

    if (!produtoASerEntregue.status_produto) {
      throw new Error('Produto Indisponível no momento!');
    }

    const estoque = produtoASerEntregue.estoque_produto;

    const { qntd } = request.params;

    const qntd_produto = Number(qntd);

    if (estoque < qntd_produto) {
      throw new Error(`O produto possui apenas ${estoque} unidades.`);
    }

    const pedidoRepository = getRepository(Pedido);

    const total = produtoASerEntregue.preco * qntd_produto;

    const status_pedido = 'Pendente';

    const tipo_da_compra = true;

    const pedidoDAO = pedidoRepository.create({
      consumidor_id,
      status_pedido,
      total,
      tipo_da_compra,
    });

    const pedido = pedidoRepository.save(pedidoDAO);

    response.status(201).json(pedido);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
 */
