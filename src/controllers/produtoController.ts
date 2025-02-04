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

      const arquivos = [];

      if (request.files.length > 0) {
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

          arquivos.push(arquivo);
        }
      }

      Object.assign(produto, { arquivos });

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

      produtosFornecedor.sort((a, b) => a.nome.localeCompare(b.nome));

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
      const arquivoRepository = getRepository(ArquivoProduto);

      const produto = await produtoRepository.findOne(id);

      const arquivosProdutos = await arquivoRepository.find({
        where: { produto_id: id },
      });

      if (!produto) {
        throw new Error('Produto não encontrado!');
      }

      if (arquivosProdutos.length > 0) {
        for (const arquivo_produto of arquivosProdutos) {
          await arquivoRepository.delete(arquivo_produto);
        }
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

  async adicionarArqProduto(
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

      if (request.files.length > 0) {
        const arquivoRepository = getRepository(ArquivoProduto);
        const resultado = [];
        for (const arq_prod of request.files) {
          const {
            key,
            originalname: nome_original,
            location: url,
            size,
          } = arq_prod;

          const arqProdutoDAO = arquivoRepository.create({
            id: key,
            nome_original,
            size,
            url,
            produto_id: id,
          });

          const arq = await arquivoRepository.save(arqProdutoDAO);
          resultado.push(arq);
        }
        response.status(200).json(resultado);
      } else {
        response.status(200).json({ message: 'Sem arquivos selecionados' });
      }
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async atualizarArqProduto(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: arquivo_id } = request.params;
      const { id: fornecedor_id } = request.user;

      if (!arquivo_id) {
        throw new Error('ID do arquivo_produto não informado!');
      }
      if (!fornecedor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const arquivoRepository = getRepository(ArquivoProduto);

      const arquivoASerEditado = await arquivoRepository.findOne({
        where: { id: arquivo_id },
      });

      if (!arquivoASerEditado) {
        throw new Error('Arquivo não encontrado!');
      }
      if (request.files.length === 1) {
        // imagens
        const fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
        // videos
        const fileExtension_vid = ['mp4', 'mpeg', 'wmv'];

        for (const arq_prod of request.files) {
          const { originalname: nome_original, size, location: url } = arq_prod;

          const novoArquivo = arquivoRepository.merge(arquivoASerEditado, {
            nome_original,
            size,
            url,
          });

          const extensao = novoArquivo.nome_original.split('.')[1];
          let arquivo_tipo = '';

          if (fileExtension_img.includes(extensao)) {
            arquivo_tipo = 'imagem';
          } else if (fileExtension_vid.includes(extensao)) {
            arquivo_tipo = 'video';
          }

          const result = await arquivoRepository.save(novoArquivo);

          Object.assign(result, { arquivo_tipo });
          response.status(200).json(result);
        }
      } else {
        response
          .status(400)
          .json({ message: 'Permitido atualizar um arquivo por vez' });
      }
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async deletarArqProduto(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id: arquivo_id } = request.params;
      const { id: fornecedor_id } = request.user;

      if (!arquivo_id) {
        throw new Error('ID do arquivo_produto não informado!');
      }
      if (!fornecedor_id) {
        throw new Error('Usuário não autenticado!');
      }

      const arquivoRepository = getRepository(ArquivoProduto);

      const arquivo = await arquivoRepository.findOne({
        where: { id: arquivo_id },
      });

      if (!arquivo) {
        throw new Error('Arquivo não encontrado!');
      }

      const arquivoDeletado = await arquivoRepository.delete(arquivo_id);

      response.status(200).json(arquivoDeletado);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }
}

export default new ProdutoController();
