import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

import Pedido from '../models/Pedido';
import ItensPedido from '../models/ItensPedido';
import Fornecedor from '../models/Fornecedor';

export const solicitarPedido = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id: consumidor_id } = request.user;
    const { compra, id: fornecedor_id } = request.params;

    // true para delivery, false para retirada
    const tipo_da_compra = compra !== 'false';

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
      tipo_da_compra,
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
};

export const listarPedidosFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id: fornecedor_id } = request.user;

    if (!fornecedor_id) {
      throw new Error('Usuário não autenticado!');
    }

    const pedidoRepository = getRepository(Pedido);

    const pedidosFornecedor = await pedidoRepository.find({
      where: { fornecedor_id },
    });

    const pedidosPendentes = pedidosFornecedor.filter(
      (pedido: Pedido): boolean => {
        return pedido.status_pedido === 'Pendente';
      },
    );
    response.status(200).json(pedidosPendentes);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const validarPedidos = async (
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
};

export const listarPedidosConsumidor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
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
};

export const historicoFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id: fornecedor_id } = request.user;

    if (!fornecedor_id) {
      throw new Error('Usuário não autenticado!');
    }

    const pedidoRepository = getRepository(Pedido);

    const pedidosFornecedor = await pedidoRepository.find({
      where: { fornecedor_id },
    });

    response.status(200).json(pedidosFornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
