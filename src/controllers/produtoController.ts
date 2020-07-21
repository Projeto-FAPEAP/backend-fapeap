import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Produto from '../models/Produto';

export const cadastrarProduto = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const produtoRepository = getRepository(Produto);
    const { id: fornecedor_id } = request.user;
    const {
      nome,
      preco,
      status_produto,
      estoque_produto,
      unidade_medida,
    } = request.body;

    if (!fornecedor_id) {
      throw new Error('Usuário não autenticado!');
    }

    const produtoDTO = produtoRepository.create({
      nome,
      preco,
      status_produto,
      estoque_produto,
      unidade_medida,
      fornecedor_id,
    });

    const produto = await produtoRepository.save(produtoDTO);

    response.status(201).json(produto);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const listarProdutos = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id: fornecedor_id } = request.user;

    if (!fornecedor_id) {
      throw new Error('Usuário não autenticado!');
    }
    const produtoRepository = getRepository(Produto);

    const produtosFornecedor = await produtoRepository.find({
      where: { fornecedor_id },
    });

    response.status(200).json(produtosFornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const listarProduto = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.params;
    const { id: fornecedor_id } = request.user;

    if (!id) {
      throw new Error('ID não informado!');
    }
    if (!fornecedor_id) {
      throw new Error('Usuário não autenticado!');
    }
    const produtoRepository = getRepository(Produto);

    const produtoFornecedor = await produtoRepository.find({
      where: { id },
    });

    if (!produtoFornecedor) {
      throw new Error('Produto não encontrado!');
    }

    response.status(200).json(produtoFornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const deletarProduto = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.params;
    const { id: fornecedor_id } = request.user;
    if (!id) {
      throw new Error('ID do produto não informado!');
    }
    if (!fornecedor_id) {
      throw new Error('Usuário não autenticado!');
    }

    const produtoRepository = getRepository(Produto);

    const produto = (
      await produtoRepository.find({ where: fornecedor_id })
    ).find(produtoInstancia => produtoInstancia.id === id);

    if (!produto) {
      throw new Error('Produto não encontrado!');
    }

    await produtoRepository.delete(id);

    response.status(200).json({ deleted: 'sucess' });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const atualizarProduto = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.params;
    const { id: fornecedor_id } = request.user;
    if (!id) {
      throw new Error('ID do produto não informado!');
    }
    if (!fornecedor_id) {
      throw new Error('Usuário não autenticado!');
    }

    const produtoRepository = getRepository(Produto);

    const produto = (
      await produtoRepository.find({ where: fornecedor_id })
    ).find(produtoInstancia => produtoInstancia.id === id);

    if (!produto) {
      throw new Error('Produto não encontrado!');
    }

    produtoRepository.merge(produto, request.body);

    const resultados = await produtoRepository.save(produto);

    response.status(200).json(resultados);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};
