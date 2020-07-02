import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('historico_pedido')
class HistoricoPedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pedido_id: string;

  @Column()
  preco_unidade: number;

  @Column()
  quantidade: number;

  @Column()
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default HistoricoPedido;
