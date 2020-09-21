/* eslint-disable func-names */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

import { stringify } from 'uuid';
import Pedido from '../models/Pedido';
import ItensPedido from '../models/ItensPedido';
import Fornecedor from '../models/Fornecedor';
import Produto from '../models/Produto';
import ArquivoFornecedor from '../models/ArquivoFornecedor';
import sendNotification from '../notificacao';

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

  async finalizarPedido(
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

      const status_pedido = 'Finalizado';

      if (pedidoASerValidado.status_pedido !== 'Pedido em rota de entrega') {
        throw new Error('Finalização do consumidor somente para delivery');
      }

      const pedido = pedidoRepository.merge(pedidoASerValidado, {
        status_pedido,
      });

      const pedidoAtualizado = await pedidoRepository.save(pedido);

      const { fornecedor_id } = pedidoAtualizado;

      sendNotification({
        title: 'Atualização do pedido',
        subtitle: 'Acompanhe seus pedidos na tela inicial',
        user_id: fornecedor_id,
        additional_data: {
          pedido_id: pedidoAtualizado.id,
          status_pedido: pedidoAtualizado.status_pedido,
        },
      });

      response.status(201).json(pedidoAtualizado);
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

      const pedidos = pedidosConsumidor.filter((pedido: Pedido): boolean => {
        return (
          pedido.status_pedido !== 'Finalizado' &&
          pedido.status_pedido !== 'Cancelado'
        );
      });

      pedidos.forEach(pedido => delete pedido.fornecedor.senha);
      pedidos.forEach(pedido => delete pedido.consumidor.senha);

      pedidos.sort(function (date01, date02) {
        return (
          new Date(date02.updated_at).valueOf() -
          new Date(date01.updated_at).valueOf()
        );
      });

      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);

      for (const pedido of pedidosConsumidor) {
        const arquivos = await arquivoFornecedorRepository.find({
          where: { fornecedor_id: pedido.fornecedor_id },
        });

        let arqFornecedor;

        for (const arquivo of arquivos) {
          const tipo_arq = arquivo.nome_original.split('.')[1];

          const fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

          if (fileExtension_img.includes(tipo_arq)) {
            arqFornecedor = arquivo;
            delete arqFornecedor.fornecedor;
            break;
          }
        }

        if (!arqFornecedor) {
          break;
        }

        delete arqFornecedor.fornecedor;

        Object.assign(pedido, { arqFornecedor });
      }

      response.status(200).json(pedidos);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async historicoPedido(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: consumidor_id } = request.user;

      if (!consumidor_id) {
        throw new Error('Usuário não autenticado!');
      }

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

      const pedidoRepository = getRepository(Pedido);

      const pedidosFornecedor = await pedidoRepository.find({
        where: { consumidor_id },
      });

      const pedidosHistorico = pedidosFornecedor.filter(
        (pedido: Pedido): boolean => {
          return (
            pedido.status_pedido === 'Finalizado' ||
            pedido.status_pedido === 'Cancelado'
          );
        },
      );

      pedidosHistorico.sort(function (date01, date02) {
        return (
          new Date(date02.updated_at).valueOf() -
          new Date(date01.updated_at).valueOf()
        );
      });

      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);

      for (const pedido of pedidosHistorico) {
        const arquivos = await arquivoFornecedorRepository.find({
          where: { fornecedor_id: pedido.fornecedor_id },
        });

        let arqFornecedor;

        for (const arquivo of arquivos) {
          const tipo_arq = arquivo.nome_original.split('.')[1];

          const fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

          if (fileExtension_img.includes(tipo_arq)) {
            arqFornecedor = arquivo;
            delete arqFornecedor.fornecedor;
            break;
          }
        }

        if (!arqFornecedor) {
          break;
        }

        Object.assign(pedido, { arqFornecedor });
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

      if (pedidoASerValidado.status_pedido === 'Pendente') {
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

      type ItensPedidoDTO = {
        id: string;
        pedido: Pedido;
        pedido_id: string;
        produto: Produto;
        produto_id: string;
        quantidade: number;
        preco_venda: number;
        created_at: Date;
        updated_at: Date;
      };

      const arrayItensPedido: Array<ItensPedidoDTO> = [];

      itensPedido.forEach(itemPedido => {
        delete itemPedido.produto.fornecedor;
      });

      response.status(200).json(arrayItensPedido);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }
}

export default new PedidoConsumidor();
