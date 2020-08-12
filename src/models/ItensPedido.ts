import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Pedido from './Pedido';
import Produto from './Produto';

@Entity('itens_pedido')
class ItensPedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pedido, pedido => pedido.itensPedidos)
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Produto, produto => produto.itens_pedidos, { eager: true })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column('uuid')
  pedido_id: string;

  @Column('uuid')
  produto_id: string;

  @Column('numeric')
  preco_venda: number;

  @Column('integer')
  quantidade: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ItensPedido;
