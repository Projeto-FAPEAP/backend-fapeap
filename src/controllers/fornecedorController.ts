/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { hash, compare } from 'bcryptjs';
import { validate } from 'class-validator';
import Fornecedor from '../models/Fornecedor';
import ArquivoFornecedor from '../models/ArquivoFornecedor';
import AvaliacaoFornecedor from '../models/AvaliacaoFornecedor';

// Remember - Não esquecer de remover o campo verificado na criacao do fornecedor

class FornecedorController {
  async cadastrarFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
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

      for (const arquivo_fornecedor of request.files) {
        const {
          key: id,
          originalname: nome_original,
          size,
          location: url,
        } = arquivo_fornecedor;

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
        throw new Error(
          'Você não preencheu os campos de arquivos corretamente!',
        );
      }

      delete fornecedor.senha;
      response.status(201).json(fornecedor);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async listarTodosFornecedores(
    _: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Carregar url dos arquivos dos fornecedores
      const fornecedorRepository = getRepository(Fornecedor);
      const avaliacaoRepository = getRepository(AvaliacaoFornecedor);
      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);

      const fornecedoresDTO = await fornecedorRepository.find({
        where: { verificado: true },
      });

      for (const fornece of fornecedoresDTO) {
        const arquivos = await arquivoFornecedorRepository.find({
          where: { fornecedor_id: fornece.id },
        });

        const avaliacoes = await avaliacaoRepository.find({
          where: { fornecedor_id: fornece.id },
        });

        const avaliacoesFornecedor = avaliacoes.map(
          avaliacao => avaliacao.estrelas,
        );

        // imagens
        const fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
        // videos
        const fileExtension_vid = ['mp4', 'mpeg', 'wmv'];

        delete fornece.senha;

        for (const arquivo of arquivos) {
          const extensao = arquivo.nome_original.split('.')[1];
          let arquivo_tipo = '';

          if (fileExtension_img.includes(extensao)) {
            arquivo_tipo = 'imagem';
          } else if (fileExtension_vid.includes(extensao)) {
            arquivo_tipo = 'video';
          }

          Object.assign(arquivo, { arquivo_tipo });

          delete arquivo.fornecedor;
        }

        Object.assign(fornece, { arquivos }, { avaliacoesFornecedor });
      }

      const fornecedores = fornecedoresDTO.sort(
        () => Math.round(Math.random()) - 0.5,
      );

      response.status(200).json(fornecedores);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async listarFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Carregar url dos arquivos do fornecedor
      const { id } = request.params;
      const fornecedorRepository = getRepository(Fornecedor);

      const fornecedor = await fornecedorRepository.findOne(id);

      if (!fornecedor) {
        throw new Error('Fornecedor não encontrado!');
      }

      const arquivoFornecedorRepository = getRepository(ArquivoFornecedor);
      const avaliacaoRepository = getRepository(AvaliacaoFornecedor);

      const arquivos = await arquivoFornecedorRepository.find({
        where: { fornecedor_id: id },
      });

      // imagens
      const fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
      // videos
      const fileExtension_vid = ['mp4', 'mpeg', 'wmv'];

      for (const arquivo of arquivos) {
        delete arquivo.fornecedor;

        const extensao = arquivo.nome_original.split('.')[1];
        let arquivo_tipo = '';

        if (fileExtension_img.includes(extensao)) {
          arquivo_tipo = 'imagem';
        } else if (fileExtension_vid.includes(extensao)) {
          arquivo_tipo = 'video';
        }

        Object.assign(arquivo, { arquivo_tipo });
      }

      delete fornecedor.senha;

      const avaliacoes = await avaliacaoRepository.find({
        where: { fornecedor_id: fornecedor.id },
      });

      const avaliacoesFornecedor = avaliacoes.map(
        avaliacao => avaliacao.estrelas,
      );

      Object.assign(fornecedor, { arquivos }, { avaliacoesFornecedor });

      response.status(200).json(fornecedor);
    } catch (error) {
      if (error.message === 'Fornecedor não encontrado!') {
        response.status(404).json({ error: error.message });
      } else {
        response.status(400).json({ error: error.message });
      }
    }
    next();
  }

  async atualizarFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = request.user;

      if (!id) {
        throw new Error('Usuário não autenticado!');
      }

      const fornecedorRepository = getRepository(Fornecedor);

      const fornecedor = await fornecedorRepository.findOne(id);

      if (!fornecedor) {
        throw new Error('Fornecedor não encontrado!');
      }

      if (request.body.senhaAtual) {
        const senhaEncontrada = await compare(
          request.body.senhaAtual,
          fornecedor.senha,
        );
        if (!senhaEncontrada) {
          throw new Error('Senha atual incorreta!');
        }

        const senha = await hash(request.body.senha, 8);
        Object.assign(request.body, { senha });
      }

      delete request.body.senhaAtual;

      fornecedorRepository.merge(fornecedor, request.body);

      const fornecedorAtualizado = await fornecedorRepository.save(fornecedor);

      response.status(200).json(fornecedorAtualizado);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async deletarFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
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
  }
}

export default new FornecedorController();
