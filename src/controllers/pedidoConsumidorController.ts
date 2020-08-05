import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

import Pedido from '../models/Pedido';
import ItensPedido from '../models/ItensPedido';
import Fornecedor from '../models/Fornecedor';

class PedidoConsumidor {
  async solicitarPedido(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: consumidor_id } = request.user;
      const { compra, id: fornecedor_id } = request.params;

      // true para delivery, false para retirada
      const delivery = compra !== 'false';

      if (!consumidor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const pedidoRepository = getRepository(Pedido);

      const status_pedido = 'Pendente';

      const pedidoDAO = pedidoRepository.create({
        consumidor_id,
        fornecedor_id,
        status_pedido,
        total: 0,
        delivery,
      });

      const pedido = await pedidoRepository.save(pedidoDAO);

      // Adiciona os itens do pedido no relacionamento entre pedido.
      const itensPedidoRepository = getRepository(ItensPedido);

      const data = request.body;

      type elementITEM = {
        produto_id: string;
        preco_venda: number;
        quantidade: number;
      };

      let total = 0;

      data.forEach(async (element: elementITEM) => {
        const { produto_id, preco_venda, quantidade } = element;

        total += Number((preco_venda * quantidade).toFixed(2));
        // TO DO - talvez precise validar a quantidade de itens a serem pedidos (não deve ultrapassar o valor do estpque)
        const itensPedidoDAO = itensPedidoRepository.create({
          pedido,
          produto_id,
          preco_venda,
          quantidade,
        });

        await itensPedidoRepository.save(itensPedidoDAO);
      });

      const fornecedor = await getRepository(Fornecedor).findOne({
        where: { id: fornecedor_id },
      });

      if (fornecedor?.taxa_delivery) {
        total += Number(fornecedor.taxa_delivery);
      }

      const novoPedido = pedidoRepository.merge(pedido, { total });

      const pedidoFinal = await pedidoRepository.save(novoPedido);

      response.status(201).json(pedidoFinal);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async listarPedidosConsumidor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: consumidor_id } = request.user;

      if (!consumidor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const pedidoRepository = getRepository(Pedido);

      const pedidosConsumidor = await pedidoRepository.find({
        where: { consumidor_id },
      });

      if (!pedidosConsumidor) {
        throw new Error('Pedido não encontrado!');
      }

      const pedidos = pedidosConsumidor.filter(
        pedido =>
          pedido.status_pedido === 'Reserva confirmada' ||
          pedido.status_pedido === 'Delivery confirmado',
      );

      response.status(200).json(pedidos);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async listarPedidoConsumidor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
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
  }
}

export default new PedidoConsumidor();
