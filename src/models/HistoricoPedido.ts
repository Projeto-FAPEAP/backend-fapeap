import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Pedido from './Pedido';

@Entity('historico_pedido')
class HistoricoPedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pedido, pedido => pedido.historicosPedido, { eager: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @Column()
  pedido_id: string;

  @Column()
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default HistoricoPedido;
