/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Produto from '../models/Produto';
import ArquivoProduto from '../models/ArquivoProduto';

class ProdutoController {
  async cadastrarProduto(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
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

      const arquivoRepository = getRepository(ArquivoProduto);

      for (const arquivo_produto of request.files) {
        const {
          key: id,
          originalname: nome_original,
          size,
          location: url,
        } = arquivo_produto;

        const arquivo = arquivoRepository.create({
          id,
          nome_original,
          size,
          url,
          produto_id: produto.id,
        });

        await arquivoRepository.save(arquivo);
      }

      response.status(201).json(produto);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async listarProdutos(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { idfornecedor: fornecedor_id } = request.params;

      if (!fornecedor_id) {
        throw new Error('ID do Fornecedor não informado!');
      }
      const produtoRepository = getRepository(Produto);

      const produtosFornecedor = await produtoRepository.find({
        where: { fornecedor_id },
      });
      const arquivoRepository = getRepository(ArquivoProduto);

      for (const produ of produtosFornecedor) {
        const arquivos = await arquivoRepository.find({
          where: { produto_id: produ.id },
        });

        Object.assign(produ, { arquivos });
      }

      response.status(200).json(produtosFornecedor);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async listarProduto(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { idproduto: id, idfornecedor: fornecedor_id } = request.params;

      if (!id) {
        throw new Error('ID produto não informado!');
      }
      if (!fornecedor_id) {
        throw new Error('ID fornecedor não informado!');
      }
      const produtoRepository = getRepository(Produto);

      const produtoFornecedor = await produtoRepository.findOne(id);

      if (!produtoFornecedor) {
        throw new Error('Produto não encontrado!');
      }

      const arquivoRepository = getRepository(ArquivoProduto);

      const arquivos = await arquivoRepository.find({
        where: { produto_id: id },
      });

      Object.assign(produtoFornecedor, { arquivos });

      response.status(200).json(produtoFornecedor);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async deletarProduto(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
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

      const produto = await produtoRepository.findOne(id);

      if (!produto) {
        throw new Error('Produto não encontrado!');
      }

      await produtoRepository.delete(id);

      response.status(200).json({ deleted: 'sucess' });
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async atualizarProduto(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
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

      const produto = await produtoRepository.findOne(id);

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
  }
}

export default new ProdutoController();
