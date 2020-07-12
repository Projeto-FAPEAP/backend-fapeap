import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import Produto from './Produto';
import Pedido from './Pedido';

@Entity('itens_pedido')
class ItensPedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Produto, produtos => produtos.itensPedido)
  produtos: Produto;

  @ManyToOne(() => Pedido, pedido => pedido.itensPedidos, { eager: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @Column()
  produto_id: string;

  @Column()
  pedido_id: string;

  @Column()
  preco_venda: number;

  @Column()
  quantidade: number;

  @Column()
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ItensPedido;
