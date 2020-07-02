import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import Pedido from './Pedido';

@Entity('produto')
class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fornecedor_id: string;

  @ManyToOne(() => Pedido, pedido => pedido.produtos)
  pedido: Pedido;

  @Column()
  nome: string;

  @Column()
  preco: number;

  @Column()
  status_pedido: boolean;

  @Column()
  unidade_medida: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Produto;
