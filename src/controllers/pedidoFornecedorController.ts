/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

import ItensPedido from '../models/ItensPedido';
import Pedido from '../models/Pedido';
import Fornecedor from '../models/Fornecedor';

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
        return (
          pedido.status_pedido !== 'Finalizado' &&
          pedido.status_pedido !== 'Cancelado'
        );
      });
      const fornecedorRepository = getRepository(Fornecedor);

      const fornecedor = await fornecedorRepository.findOne({
        where: { id: fornecedor_id },
      });

      const taxa_entrega = Number(fornecedor?.taxa_delivery) || 0;

      pedidos.forEach(pedido => {
        const subtotal = pedido.total - taxa_entrega;
        Object.assign(pedido, { subtotal }, { taxa_entrega });
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
        pedidoASerValidado.status_pedido === 'Pedido em rota de entrega'
      ) {
        status_pedido = 'Finalizado';
      } else if (pedidoASerValidado.status_pedido === 'Pendente') {
        status_pedido = 'Reserva confirmada';
        if (pedidoASerValidado.delivery) {
          status_pedido = 'Delivery confirmado';
        }
      } else if (pedidoASerValidado.status_pedido === 'Delivery confirmado') {
        status_pedido = 'Pedido em rota de entrega';
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

      const { page } = request.query || 1;
      const numeroPagina = String(page);
      const { limit } = request.query || 30;
      const numeroLimite = String(limit);

      if (numeroPagina === undefined && numeroLimite === undefined) {
        throw new Error('Query ausente! Deve ser passado page e limit');
      }

      const pagina = parseInt(numeroPagina, 10);
      const limite = parseInt(numeroLimite, 10);

      const [indexInicial, indexFinal] = [
        (pagina - 1) * limite,
        pagina * limite,
      ];

      type HistorioDTO = {
        historico: Pedido[];
        page: number;
        perPage: number;
        pages: number;
        total: number;
      };

      if (!fornecedor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const pedidoRepository = getRepository(Pedido);

      const pedidosFornecedor = await pedidoRepository.find({
        where: { fornecedor_id },
      });

      const pedidosHistorico = pedidosFornecedor.filter(
        (pedido: Pedido): boolean => {
          return (
            pedido.status_pedido === 'Finalizado' ||
            pedido.status_pedido === 'Cancelado'
          );
        },
      );

      const historico = pedidosHistorico.slice(indexInicial, indexFinal);
      const total_pedidos = historico.length;
      const paginas = Math.ceil(total_pedidos / limite);

      const historicoResponse: HistorioDTO = {
        historico,
        page: pagina,
        perPage: limite,
        pages: paginas,
        total: total_pedidos,
      };

      response.status(200).json(historicoResponse);
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
