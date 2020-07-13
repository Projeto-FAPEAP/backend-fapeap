import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  telefone_whatsapp: string;

  @Column()
  logradouro: string;

  @Column()
  numero_local: string;

  @Column()
  bairro: string;

  @Column()
  cep: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Usuario;
