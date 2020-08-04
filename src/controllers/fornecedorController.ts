/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { hash } from 'bcryptjs';
import { validate } from 'class-validator';

import Fornecedor from '../models/Fornecedor';
import ArquivoFornecedor from '../models/ArquivoFornecedor';

export const listarTodosFornecedores = async (
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Carregar url dos arquivos dos fornecedores
    const fornecedorRepository = getRepository(Fornecedor);
    const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);

    const fornecedores = await fornecedorRepository.find({
      where: { verificado: true },
    });

    const resultado = [];

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

// Remember - Não esquecer de remover o campo verificado na criacao do fornecedor
export const cadastrarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const fornecedorRepository = getRepository(Fornecedor);
    const {
      nome,
      nome_fantasia,
      cpf_cnpj,
      email,
      senha,
      telefone,
      telefone_whatsapp,
      taxa_delivery,
      logradouro,
      numero_local,
      bairro,
      cep,
    } = request.body;

    const checkEmailExists = await fornecedorRepository.findOne({
      where: { email },
    });

    const checkCpfExists = await fornecedorRepository.findOne({
      where: { cpf_cnpj },
    });

    if (checkEmailExists) {
      throw new Error('Email já existe!');
    }

    if (checkCpfExists) {
      throw new Error('CPF/CNPJ já existe!');
    }

    const hashedSenha = await hash(senha, 8);

    const fornecedorDTO = fornecedorRepository.create({
      nome,
      nome_fantasia,
      cpf_cnpj,
      email,
      senha: hashedSenha,
      telefone,
      telefone_whatsapp,
      taxa_delivery,
      logradouro,
      numero_local,
      bairro,
      cep,
      verificado: true,
    });

    const errors = await validate(fornecedorDTO);

    if (errors.length > 0) {
      response
        .status(400)
        .json({ error: 'Alguns campos são inválidos', errors });
    }

    const fornecedor = await fornecedorRepository.save(fornecedorDTO);

    const arquivoRepository = getRepository(ArquivoFornecedor);

    console.log(request.files);

    for (const arquivo_fornecedor of request.files) {
      const {
        key: id,
        originalname: nome_original,
        size,
        location: url,
      } = arquivo_fornecedor;

      console.log(arquivo_fornecedor);

      const arquivo = arquivoRepository.create({
        id,
        nome_original,
        size,
        url,
        fornecedor_id: fornecedor.id,
      });

      await arquivoRepository.save(arquivo);
    }

    if (request.files.length === 0) {
      const { id } = fornecedor;
      await fornecedorRepository.delete({ id });
      throw new Error('Você não preencheu os campos de arquivos corretamente!');
    }

    delete fornecedor.senha;
    response.status(201).json(fornecedor);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const listarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Carregar url dos arquivos do fornecedor
    const { id } = request.params;
    const fornecedorRepository = getRepository(Fornecedor);

    const fornecedor = await fornecedorRepository.findOne(id);

    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado!');
    }

    const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);

    const arquivos = await arquivoFornecedorRepository.find({
      where: { fornecedor_id: id },
    });

    arquivos.forEach(arq => delete arq.fornecedor);
    delete fornecedor.senha;

    const resultado = { fornecedor, arquivos };

    response.status(200).json(resultado);
  } catch (error) {
    if (error.message === 'Fornecedor não encontrado!') {
      response.status(404).json({ error: error.message });
    } else {
      response.status(400).json({ error: error.message });
    }
  }
  next();
};

export const deletarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = request.user;

    if (!id) {
      throw new Error('Usuário não autenticado!');
    }

    const fornecedorRepository = getRepository(Fornecedor);

    await fornecedorRepository.delete(id);

    response.status(200).json({ deleted: 'sucess' });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  next();
};

export const atualizarFornecedor = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
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
};
