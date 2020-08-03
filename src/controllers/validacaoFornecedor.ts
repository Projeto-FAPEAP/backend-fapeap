/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */

import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import Fornecedor from '../models/Fornecedor';
import ArquivoFornecedor from '../models/ArquivoFornecedor';

export const listarForneceodresNaoVerificados = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
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
};
