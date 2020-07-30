import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Produto from '../models/Produto';
import Pedido from '../models/Pedido';
import Fornecedor from '../models/Fornecedor';

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

    const { fornecedor_id } = produtoASerReservado;

    const status_pedido = 'Pendente';

    const fornecedorRepository = getRepository(Fornecedor);

    const fornecedor = await fornecedorRepository.findOne({
      id: fornecedor_id,
    });

    const { tipo_da_compra } = request.body;

    if (!fornecedor?.taxa_delivery && tipo_da_compra) {
      throw new Error('O fornecedor só oferece opção de reserva/retirada');
    }

    const pedidoDAO = pedidoRepository.create({
      consumidor_id,
      fornecedor_id,
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

    let status_pedido = 'Reserva confirmada';

    if (pedidoASerValidado.tipo_da_compra) {
      status_pedido = 'Delivery confirmado';
    }

    const pedido = pedidoRepository.merge(pedidoASerValidado, {
      status_pedido,
    });
    const pedidoAtualizado = await pedidoRepository.save(pedido);

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
