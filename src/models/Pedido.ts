import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import ItensPedido from './ItensPedido';
import Consumidor from './Consumidor';
import Fornecedor from './Fornecedor';
import HistoricoPedido from './HistoricoPedido';

/**
 * Um para um (OneToOne) x
 * Um para Muitos (OneToMany) -> Um consumidor tem muitos pedidos.
 * Muitos para Muitos (ManyToMany) x
 */

@Entity('pedido')
class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ItensPedido, intens_pedidos => intens_pedidos.pedido)
  itensPedidos: ItensPedido;

  @OneToMany(() => HistoricoPedido, historicosPedido => historicosPedido.pedido)
  historicosPedido: ItensPedido;

  @ManyToOne(() => Consumidor, consumidor => consumidor.pedidos, {
    eager: true,
  })
  @JoinColumn({ name: 'consumidor_id' })
  consumidor: Consumidor;

  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.pedidos, {
    eager: true,
  })
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;

  @Column()
  consumidor_id: string;

  @Column()
  fornecedor_id: string;

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
