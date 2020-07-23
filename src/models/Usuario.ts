import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  nome: string;

  @Column('varchar')
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
