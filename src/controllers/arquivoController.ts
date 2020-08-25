/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import ArquivoFornecedor from '../models/ArquivoFornecedor';

class ArquivoController {
  async listaArquivosFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);
      const { id: fornecedor_id } = request.user;
      const arquivos = await arquivoFornecedorRepository.find({
        where: { fornecedor_id },
      });

      response.status(201).json(arquivos);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async atualizarArqImagemFornecedor(
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

      const arquivoRepository = getRepository(ArquivoFornecedor);

      const arquivoASerEditado = await arquivoRepository.findOne({
        where: { id: arquivo_id },
      });

      if (!arquivoASerEditado) {
        throw new Error('Arquivo não encontrado!');
      }

      if (request.files.length === 1) {
        // imagens
        const fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

        for (const arq_fornecedor of request.files) {
          const {
            originalname: nome_original,
            size,
            location: url,
          } = arq_fornecedor;

          const novoArquivo = arquivoRepository.merge(arquivoASerEditado, {
            nome_original,
            size,
            url,
          });

          const extensao = novoArquivo.nome_original.split('.')[1];
          let arquivo_tipo = '';

          if (fileExtension_img.includes(extensao)) {
            arquivo_tipo = 'imagem';
          } else {
            throw new Error(
              'Permitido atualizar somente imagens para este campo!',
            );
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

  async atualizarArqVideoFornecedor(
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

      const arquivoRepository = getRepository(ArquivoFornecedor);

      const arquivoASerEditado = await arquivoRepository.findOne({
        where: { id: arquivo_id },
      });

      if (!arquivoASerEditado) {
        throw new Error('Arquivo não encontrado!');
      }

      if (request.files.length === 1) {
        // videos
        const fileExtension_vid = ['mp4', 'mpeg', 'wmv', 'mkv', '3gp'];

        for (const arq_fornecedor of request.files) {
          const {
            originalname: nome_original,
            size,
            location: url,
          } = arq_fornecedor;

          const novoArquivo = arquivoRepository.merge(arquivoASerEditado, {
            nome_original,
            size,
            url,
          });

          const extensao = novoArquivo.nome_original.split('.')[1];
          let arquivo_tipo = '';

          if (fileExtension_vid.includes(extensao)) {
            arquivo_tipo = 'video';
          } else {
            throw new Error(
              'Permitido atualizar somente video para este campo!',
            );
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
}

export default new ArquivoController();
