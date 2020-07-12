import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Pedido from './Pedido';

@Entity('consumidor')
class Consumidor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Pedido, pedidos => pedidos.consumidor)
  pedidos: Pedido;

  @Column()
  nome: string;

  @Column()
  cpf: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  telefone_whatsapp: string;

  @Column()
  logradouro: string;

  @Column()
  numero_casa: string;

  @Column()
  bairro: string;

  @Column()
  cep: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Consumidor;
