import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Produto from '../models/Produto';
import Pedido from '../models/Pedido';
import ItensPedido from '../models/ItensPedido';

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

    const { tipo_da_compra } = request.body;

    const pedidoDAO = pedidoRepository.create({
      consumidor_id,
      fornecedor_id,
      status_pedido,
      total,
      tipo_da_compra,
    });

    const pedido = await pedidoRepository.save(pedidoDAO);

    // Remember -> Verificar se a lógica abaixo faz sentido pra esse controller
    const itensPedidoRepo = getRepository(ItensPedido);

    const { preco: preco_venda, id: produto_id } = produtoASerReservado;
    const quantidade = qntd_produto;
    const { id: pedido_id } = pedido;

    const itensPedidoDAO = itensPedidoRepo.create({
      produto_id,
      pedido_id,
      preco_venda,
      quantidade,
    });

    await itensPedidoRepo.save(itensPedidoDAO);

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
      where: fornecedor_id,
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
      where: pedido_id,
    });

    if (!pedidoASerValidado) {
      throw new Error('Pedido não encontrado!');
    }

    let status_pedido = 'Reservado';

    if (pedidoASerValidado.tipo_da_compra) {
      status_pedido = 'Delivery';
    }

    pedidoASerValidado.status_pedido = status_pedido;

    response.status(201).json(pedidoASerValidado);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
