/* eslint-disable array-callback-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

import ItensPedido from '../models/ItensPedido';
import Pedido from '../models/Pedido';
import Fornecedor from '../models/Fornecedor';
import Produto from '../models/Produto';
import sendNotification from '../notificacao';

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

      const itensPedidoRepository = getRepository(ItensPedido);

      const itensPedido = await itensPedidoRepository.find({
        where: { pedido_id: pedidoASerValidado.id },
      });

      const dataItens = itensPedido.map(item => {
        const obj = {
          produto_id: item.produto_id,
          quantidade: item.quantidade,
        };
        return obj;
      });

      let status_pedido;
      const produtoRepository = getRepository(Produto);

      if (
        pedidoASerValidado.status_pedido === 'Reserva confirmada' ||
        pedidoASerValidado.status_pedido === 'Pedido em rota de entrega'
      ) {
        status_pedido = 'Finalizado';
      } else if (pedidoASerValidado.status_pedido === 'Pendente') {
        status_pedido = 'Reserva confirmada';

        for (const item of dataItens) {
          const { produto_id, quantidade } = item;

          const produto = await produtoRepository.findOne({
            where: { id: produto_id },
          });

          if (!produto) {
            throw new Error('Não foi possivel confirmar o pedido');
          }

          const estoque_produto = Number(produto.estoque_produto) - quantidade;

          const produtoMerge = produtoRepository.merge(produto, {
            estoque_produto,
          });

          await produtoRepository.save(produtoMerge);
        }

        if (pedidoASerValidado.delivery) {
          status_pedido = 'Delivery confirmado';
        }
      } else if (pedidoASerValidado.status_pedido === 'Delivery confirmado') {
        status_pedido = 'Pedido em rota de entrega';
      }

      const pedido = pedidoRepository.merge(pedidoASerValidado, {
        status_pedido,
      });

      const { consumidor_id } = pedido;

      const pedidoAtualizado = await pedidoRepository.save(pedido);

      sendNotification({
        title: 'Atualização do pedido',
        subtitle: 'Acompanhe seus pedidos na tela inicial',
        user_id: consumidor_id,
        additional_data: {
          pedido_id: pedido.id,
          status_pedido,
        },
      });

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
      if (pedidoASerValidado.status_pedido === 'Reserva confirmada') {
        status_pedido = 'Cancelado';

        const itensPedidoRepository = getRepository(ItensPedido);
        const produtoRepository = getRepository(Produto);

        const itensPedido = await itensPedidoRepository.find({
          where: { pedido_id: pedidoASerValidado.id },
        });

        const dataItens = itensPedido.map(item => {
          const obj = {
            produto_id: item.produto_id,
            quantidade: item.quantidade,
          };
          return obj;
        });

        for (const item of dataItens) {
          const { produto_id, quantidade } = item;

          const produto = await produtoRepository.findOne({
            where: { id: produto_id },
          });

          if (!produto) {
            throw new Error('Produto não encontrado');
          }

          const estoque_produto = Number(produto.estoque_produto) + quantidade;

          const produtoMerge = produtoRepository.merge(produto, {
            estoque_produto,
          });

          await produtoRepository.save(produtoMerge);
        }

        const pedido = pedidoRepository.merge(pedidoASerValidado, {
          status_pedido,
        });
        const pedidoAtualizado = await pedidoRepository.save(pedido);

        response.status(201).json(pedidoAtualizado);
      } else if (pedidoASerValidado.status_pedido === 'Pendente') {
        status_pedido = 'Cancelado';

        const pedido = pedidoRepository.merge(pedidoASerValidado, {
          status_pedido,
        });

        const pedidoAtualizado = await pedidoRepository.save(pedido);

        const { consumidor_id, id } = pedido;

        sendNotification({
          title: 'Atualização do pedido',
          subtitle: 'Acompanhe seus pedidos na tela inicial',
          user_id: consumidor_id,
          additional_data: {
            type: 'STATUS_PEDIDO',
            pedido_id: id,
            status_pedido,
          },
        });

        response.status(201).json(pedidoAtualizado);
      } else {
        throw new Error(
          'Cancelamento somente para pedidos Pendentes e de Reserva',
        );
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

      const page = request.query.page || 1;
      const numeroPagina = String(page);
      const limit = request.query.limit || 30;
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

      const fornecedorRepository = getRepository(Fornecedor);

      const fornecedor = await fornecedorRepository.findOne({
        where: { id: fornecedor_id },
      });

      let taxa;

      if (!fornecedor) {
        taxa = 0;
      }

      taxa = fornecedor?.taxa_delivery;

      const taxa_entrega = Number(taxa) || 0;

      pedidosHistorico.forEach(pedido => {
        const subtotal = pedido.total - taxa_entrega;
        Object.assign(pedido, { subtotal }, { taxa_entrega });
      });

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

      const pedidoRepository = getRepository(Pedido);

      const pedidoFornecedor = await pedidoRepository.findOne({
        where: { id: pedido_id },
      });

      if (!pedidoFornecedor) {
        throw new Error('Pedido não encontrado');
      }

      const fornecedorRepository = getRepository(Fornecedor);

      const fornecedor = await fornecedorRepository.findOne({
        where: { id: fornecedor_id },
      });

      const taxa_entrega = Number(fornecedor?.taxa_delivery) || 0;

      const subtotal = pedidoFornecedor.total - taxa_entrega;
      const {
        nome,
        logradouro,
        bairro,
        numero_local,
        cep,
      } = pedidoFornecedor.consumidor;
      const { delivery, status_pedido, total, created_at } = pedidoFornecedor;

      const objPedido = {
        nome,
        logradouro,
        bairro,
        numero_local,
        cep,
        delivery,
        status_pedido,
        total,
        taxa_entrega,
        created_at,
      };

      Object.assign(objPedido, { subtotal }, { taxa_entrega });

      const itensPedidoRepository = getRepository(ItensPedido);

      const itensPedido = await itensPedidoRepository.find({
        where: { pedido_id },
      });

      itensPedido.forEach(itemPedido => {
        delete itemPedido.produto.fornecedor;
      });

      response.status(200).json({ itensPedido, objPedido });
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }
}

export default new PedidoFornecedor();
