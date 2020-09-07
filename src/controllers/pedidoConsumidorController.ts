/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
// import OneSignal from 'onesignal-node';

import Pedido from '../models/Pedido';
import ItensPedido from '../models/ItensPedido';
import Fornecedor from '../models/Fornecedor';
import Produto from '../models/Produto';
import ArquivoFornecedor from '../models/ArquivoFornecedor';
import sendNotification from '../notificacao';
// import apiOneSignal from '../config/apiOneSignal';

class PedidoConsumidor {
  async solicitarPedido(
    request: Request,
    response: Response,
  ): Promise<Response> {
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

      let total = 0;
      let subtotal;

      for (const dataDTO of data) {
        const { produto_id, preco_venda, quantidade } = dataDTO;

        total += Number((preco_venda * quantidade).toFixed(2));
        subtotal = total;
        // TO DO - talvez precise validar a quantidade de itens a serem pedidos (não deve ultrapassar o valor do estpque)
        const itensPedidoDAO = itensPedidoRepository.create({
          pedido_id: pedido.id,
          produto_id,
          preco_venda,
          quantidade,
        });

        await itensPedidoRepository.save(itensPedidoDAO);
      }

      const fornecedor = await getRepository(Fornecedor).findOne({
        where: { id: fornecedor_id },
      });

      let taxa_entrega = 0;

      if (!fornecedor) {
        throw new Error('Fornecedor não encontrado');
      }

      if (fornecedor.taxa_delivery !== null && delivery) {
        total += Number(fornecedor.taxa_delivery);
        taxa_entrega = Number(fornecedor.taxa_delivery);
      }

      const novoPedido = pedidoRepository.merge(pedido, { total });

      const pedidoFinal = await pedidoRepository.save(novoPedido);

      Object.assign(pedidoFinal, { subtotal }, { taxa_entrega });

      sendNotification({
        title: 'Você tem um novo pedido',
        subtitle: 'Acompanhe seus pedidos na tela inicial',
        user_id: fornecedor_id,
        additional_data: { pedido_id: pedido.id, status_pedido },
      });

      return response.status(201).json(pedidoFinal);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
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
        pedido => pedido.status_pedido !== 'Finalizado',
      );

      pedidos.forEach(pedido => delete pedido.fornecedor.senha);
      pedidos.forEach(pedido => delete pedido.consumidor.senha);

      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);

      for (const pedido of pedidosConsumidor) {
        const arquivos = await arquivoFornecedorRepository.find({
          where: { fornecedor_id: pedido.fornecedor_id },
        });

        const arqFornece = arquivos[0];

        delete arqFornece.fornecedor;

        Object.assign(pedido, { arqFornece });
      }

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

      const { fornecedor_id } = pedidoConsumidor;

      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);

      const arquivos = await arquivoFornecedorRepository.find({
        where: { fornecedor_id },
      });

      const arqFornecedor = arquivos[0];

      response.status(200).json({ pedidoConsumidor, arqFornecedor });
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
      const { id: consumidor_id } = request.user;
      const { id: pedido_id } = request.params;

      if (!consumidor_id) {
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

        sendNotification({
          title: 'O consumidor cancelou o pedido',
          subtitle: 'Acompanhe seus pedidos na tela inicial',
          user_id: pedido.fornecedor_id,
          additional_data: { pedido_id: pedido.id, status_pedido },
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

  async listarPedidosFinalizados(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: consumidor_id } = request.user;

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

      if (!consumidor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const pedidoRepository = getRepository(Pedido);

      const pedidosFornecedor = await pedidoRepository.find({
        where: { consumidor_id },
      });

      const pedidosHistorico = pedidosFornecedor.filter(
        (pedido: Pedido): boolean => {
          return pedido.status_pedido === 'Finalizado';
        },
      );

      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);

      for (const pedido of pedidosHistorico) {
        const arquivos = await arquivoFornecedorRepository.find({
          where: { fornecedor_id: pedido.fornecedor_id },
        });

        const arqFornece = arquivos[0];

        delete arqFornece.fornecedor;

        Object.assign(pedido, { arqFornece });
      }

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

  async listarDetalhesPedidoConsumidor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: consumidor_id } = request.user;

      const { id: pedido_id } = request.params;

      if (!consumidor_id) {
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

export default new PedidoConsumidor();
