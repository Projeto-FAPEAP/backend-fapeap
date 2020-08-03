/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Pedido from '../models/Pedido';
import ItensPedido from '../models/ItensPedido';

export const listarPedidoConsumidor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.params;
    const { id: consumidor_id } = request.user;

    if (!id) {
      throw new Error('ID não informado!');
    }
    if (!consumidor_id) {
      throw new Error('Usuário não autenticado!');
    }
    const pedidoRepository = getRepository(Pedido);

    const pedidoConsumidor = await pedidoRepository.findOne(id);

    if (!pedidoConsumidor) {
      throw new Error('Pedido não encontrado!');
    }

    response.status(200).json(pedidoConsumidor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const listarDetalhesPedidoFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id: fornecedor_id } = request.user;

    const { id: pedido_id } = request.params;

    if (!fornecedor_id) {
      throw new Error('Usuário não autenticado!');
    }

    if (!pedido_id) {
      throw new Error('ID do pedido não informado!');
    }

    const itensPedidoRepository = getRepository(ItensPedido);

    const itensPedido = await itensPedidoRepository.find({
      where: { pedido_id },
    });

    itensPedido.forEach(itemPedido => {
      const nome_consumidor = itemPedido.pedido.consumidor.nome;
      Object.assign(itemPedido, nome_consumidor);
      delete itemPedido.produto.fornecedor;
    });

    response.status(200).json(itensPedido);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
