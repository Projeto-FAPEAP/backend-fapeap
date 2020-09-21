import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import Consumidor from '../models/Consumidor';
import Fornecedor from '../models/Fornecedor';
import jwtConfig from '../config/auth';
import { transport as mailer } from '../config/mailer';

class SessaoController {
  async autenticarConsumidor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { cpf, senha } = request.body;
      const consumidorRepository = getRepository(Consumidor);
      const consumidor = await consumidorRepository.findOne({
        where: { cpf },
      });

      if (!consumidor) {
        throw new Error('CPF ou senha incorretos!');
      }

      const senhaEncontrada = await compare(senha, consumidor.senha);

      if (!senhaEncontrada) {
        throw new Error('CPF ou senha incorretos!');
      }

      const { jwt_consumidor } = jwtConfig;

      const tokenConsumidor = sign({}, jwt_consumidor.secret, {
        subject: consumidor.id,
        expiresIn: jwt_consumidor.expiresIn,
      });

      delete consumidor.senha;

      const consumidorDTO = { consumidor, tokenConsumidor };

      response.json(consumidorDTO);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async autenticarAdmin(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, senha } = request.body;
      const consumidorRepository = getRepository(Consumidor);
      const admin = await consumidorRepository.findOne({
        where: { email },
      });

      if (!admin) {
        throw new Error('Email ou senha incorretos!');
      }

      const senhaEncontrada = await compare(senha, admin.senha);

      if (!senhaEncontrada) {
        throw new Error('Email ou senha incorretos!');
      }

      const { jwt_admin } = jwtConfig;

      const tokenAdmin = sign({}, jwt_admin.secret, {
        subject: admin.id,
        expiresIn: jwt_admin.expiresIn,
      });

      delete admin.senha;

      const AdminDTO = { admin, tokenAdmin };

      response.json(AdminDTO);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async autenticarFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { cpf_cnpj, senha } = request.body;
      const fornecedorRepository = getRepository(Fornecedor);
      const fornecedor = await fornecedorRepository.findOne({
        where: { cpf_cnpj },
      });

      if (!fornecedor) {
        throw new Error('Cpf ou senha incorretos!');
      }

      const senhaEncontrada = await compare(senha, fornecedor.senha);

      if (!senhaEncontrada) {
        throw new Error('Cpf ou senha incorretos!');
      }

      if (
        !fornecedor.verificado ||
        (fornecedor.verificado && fornecedor.status_aprovado === 'Não aprovado')
      ) {
        response.status(200).json(fornecedor);
      }

      const { jwt_fornecedor } = jwtConfig;

      const tokenFornecedor = sign({}, jwt_fornecedor.secret, {
        subject: fornecedor.id,
        expiresIn: jwt_fornecedor.expiresIn,
      });

      delete fornecedor.senha;
      const fornecedorDTO = { fornecedor, tokenFornecedor };
      response.json(fornecedorDTO);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async resetSenhaFornecedor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { cpf_cnpj } = request.body;

      const fornecedorRepository = getRepository(Fornecedor);
      const fornecedor = await fornecedorRepository.findOne({
        where: { cpf_cnpj },
      });

      if (!fornecedor) {
        throw new Error('Usuário não encontrado');
      }

      /*       const token = crypto.randomBytes(20).toString('hex');

      const dataAtual = new Date();

      dataAtual.setHours(Number(dataAtual.getHours) + 1); */

      /*    const fornecedorDTO = fornecedorRepository.merge(fornecedor, {
        senhaResetToken: token,
        senhaResetExpires: dataAtual,
      });

      await fornecedorRepository.save(fornecedorDTO); */

      const novaSenha = uuidv4().slice(0, 7);

      const hashedSenha = await hash(novaSenha, 8);

      const fornecedorNovaSenha = fornecedorRepository.merge(fornecedor, {
        senha: hashedSenha,
      });

      await fornecedorRepository.save(fornecedorNovaSenha);

      mailer.sendMail({
        to: fornecedor.email,
        from: 'leozartino@outlook.com',
        subject: 'Esqueceu sua senha?',
        text: `${'Você está recebendo isto porque você (ou outra pessoa) solicitou a redefinição da senha de sua conta.\n'} ${'Use a nova senha para acessar sua conta no aplicativo e após isso altere para uma senha própria. \n'} ${novaSenha}`,
      });

      response.json({ message: 'Senha resetada com sucesso' });
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }

  async resetSenhaConsumidor(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { cpf } = request.body;

      const consumidorRepository = getRepository(Consumidor);
      const consumidor = await consumidorRepository.findOne({
        where: { cpf },
      });

      if (!consumidor) {
        throw new Error('Usuário não encontrado');
      }

      /*       const token = crypto.randomBytes(20).toString('hex');

      const dataAtual = new Date();

      dataAtual.setHours(Number(dataAtual.getHours) + 1); */

      /*    const fornecedorDTO = fornecedorRepository.merge(fornecedor, {
        senhaResetToken: token,
        senhaResetExpires: dataAtual,
      });

      await fornecedorRepository.save(fornecedorDTO); */

      const novaSenha = uuidv4().slice(0, 7);

      const hashedSenha = await hash(novaSenha, 8);

      const consumidorNovaSenha = consumidorRepository.merge(consumidor, {
        senha: hashedSenha,
      });

      await consumidorRepository.save(consumidorNovaSenha);

      mailer.sendMail({
        to: consumidor.email,
        from: 'leozartino@outlook.com',
        subject: 'Esqueceu sua senha?',
        text: `${'Você está recebendo isto porque você (ou outra pessoa) solicitou a redefinição da senha de sua conta.\n'} ${'Use a nova senha para acessar sua conta no aplicativo e após isso altere para uma senha própria. \n'} ${novaSenha}`,
      });

      response.json({ message: 'Senha resetada com sucesso' });
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
    next();
  }
}

export default new SessaoController();
