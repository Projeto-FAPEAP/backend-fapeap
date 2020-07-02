import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Consumidor from './Consumidor';
import Produto from './Produto';
/**
 * Um para um (OneToOne) x
 * Um para Muitos (OneToMany) -> Um consumidor tem muitos pedidos.
 * Muitos para Muitos (ManyToMany) x
 */

@Entity('pedido')
class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  consumidor_id: string;

  @Column()
  produto_id: string;

  @JoinColumn({ name: 'produto_id' })
  @OneToMany(() => Produto, produtos => produtos.pedido, { eager: true })
  produtos: Produto;

  @JoinColumn({ name: 'consumidor_id' })
  @ManyToOne(() => Consumidor, consumidor => consumidor.pedidos, {
    eager: true,
  })
  consumidor: Consumidor;

  @Column()
  total: number;

  @Column()
  status_pedido: boolean;

  @Column()
  tipo_da_compra: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Pedido;
