import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  IsEmail,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsAlpha,
} from 'class-validator';

abstract class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  @MaxLength(50, { message: 'O nome precisa ter no máximo 50 caracteres' })
  @MinLength(2, { message: 'O nome precisa ter no minimo duas letras' })
  @IsNotEmpty()
  nome: string;

  @Column('varchar')
  @IsEmail()
  email: string;

  @Column('varchar')
  senha: string;

  @Column('varchar')
  telefone_whatsapp: string;

  @Column('varchar')
  logradouro: string;

  @Column('varchar')
  numero_local: string;

  @Column('varchar')
  bairro: string;

  @Column('varchar')
  cep: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Usuario;
