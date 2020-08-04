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
}

export default new ArquivoController();
