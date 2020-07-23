import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Pedido from './Pedido';
import Produto from './Produto';

@Entity('itens_pedido')
class ItensPedido {
  @PrimaryColumn()
  pedido_id: string;

  @PrimaryColumn()
  produto_id: string;

  @ManyToOne(() => Pedido, pedido => pedido.itensPedidos, { eager: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Produto, produto => produto.itens_pedidos, { eager: true })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column('numeric')
  preco_venda: number;

  @Column('integer')
  quantidade: number;

  @Column('numeric')
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ItensPedido;
