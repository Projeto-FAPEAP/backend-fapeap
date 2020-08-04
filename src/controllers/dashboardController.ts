/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */

import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Fornecedor from '../models/Fornecedor';
import ArquivoFornecedor from '../models/ArquivoFornecedor';

class DashboardController {
  async listarForneceodresNaoVerificados(
    _: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Carregar url dos arquivos dos fornecedores
      const fornecedorRepository = getRepository(Fornecedor);
      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);
      const fornecedores = await fornecedorRepository.find({
        where: { verificado: false },
      });

      const resultado = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const fornece of fornecedores) {
        const arquivos = await arquivoFornecedorRepository.find({
          where: { fornecedor_id: fornece.id },
        });

        delete fornece.senha;
        arquivos.forEach(arq => delete arq.fornecedor);

        resultado.push(fornece);
        resultado.push({ arquivos });
      }

      response.status(200).json(resultado);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async validarFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = request.params;

      if (!id) {
        throw new Error('ID do fornecedor não informado!');
      }

      const fornecedorRepository = getRepository(Fornecedor);

      const fornecedor = await fornecedorRepository.findOne(id);

      if (!fornecedor) {
        throw new Error('Fornecedor não encontrado!');
      }

      fornecedorRepository.merge(fornecedor, request.body);

      const resultados = await fornecedorRepository.save(fornecedor);

      response.status(200).json(resultados);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }
}

export default new DashboardController();
