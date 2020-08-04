/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

import ItensPedido from '../models/ItensPedido';
import Pedido from '../models/Pedido';

class PedidoFornecedor {
  async listarPedidosFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: fornecedor_id } = request.user;

      if (!fornecedor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const pedidoRepository = getRepository(Pedido);

      const pedidosFornecedor = await pedidoRepository.find({
        where: { fornecedor_id },
      });

      const pedidos = pedidosFornecedor.filter((pedido: Pedido): boolean => {
        return pedido.status_pedido !== 'Finalizado';
      });
      response.status(200).json(pedidos);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async validarPedidos(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: fornecedor_id } = request.user;
      const { id: pedido_id } = request.params;

      if (!fornecedor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const pedidoRepository = getRepository(Pedido);

      const pedidoASerValidado = await pedidoRepository.findOne({
        where: { id: pedido_id },
      });

      if (!pedidoASerValidado) {
        throw new Error('Pedido não encontrado!');
      }

      let status_pedido;

      if (
        pedidoASerValidado.status_pedido === 'Reserva confirmada' ||
        pedidoASerValidado.status_pedido === 'Delivery confirmado'
      ) {
        status_pedido = 'Finalizado';
      } else if (pedidoASerValidado.status_pedido === 'Pendente') {
        status_pedido = 'Reserva confirmada';
        if (pedidoASerValidado.tipo_da_compra) {
          status_pedido = 'Delivery confirmado';
        }
      }

      const pedido = pedidoRepository.merge(pedidoASerValidado, {
        status_pedido,
      });
      const pedidoAtualizado = await pedidoRepository.save(pedido);

      // Carregar todos os itens pedidos associados ao pedido
      // Ter uma rota para cancelamento de pedido, ou passar no request.body

      response.status(201).json(pedidoAtualizado);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async cancelarPedido(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: fornecedor_id } = request.user;
      const { id: pedido_id } = request.params;

      if (!fornecedor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const pedidoRepository = getRepository(Pedido);

      const pedidoASerValidado = await pedidoRepository.findOne({
        where: { id: pedido_id },
      });

      if (!pedidoASerValidado) {
        throw new Error('Pedido não encontrado!');
      }

      let status_pedido;
      if (pedidoASerValidado.status_pedido === 'Pendente') {
        status_pedido = 'Cancelado';

        const pedido = pedidoRepository.merge(pedidoASerValidado, {
          status_pedido,
        });
        const pedidoAtualizado = await pedidoRepository.save(pedido);

        response.status(201).json(pedidoAtualizado);
      } else {
        throw new Error('Cancelamento somente para pedidos Pendentes');
      }
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async historicoFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: fornecedor_id } = request.user;

      if (!fornecedor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const pedidoRepository = getRepository(Pedido);

      const pedidosFornecedor = await pedidoRepository.find({
        where: { fornecedor_id },
      });

      const pedidosFinalizados = pedidosFornecedor.filter(
        (pedido: Pedido): boolean => {
          return pedido.status_pedido === 'Finalizado';
        },
      );
      response.status(200).json(pedidosFinalizados);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async listarDetalhesPedidoFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
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
        delete itemPedido.produto.fornecedor;
      });

      response.status(200).json(itensPedido);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }
}

export default new PedidoFornecedor();
