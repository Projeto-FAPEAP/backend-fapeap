import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Pedido from '../models/Pedido';

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
