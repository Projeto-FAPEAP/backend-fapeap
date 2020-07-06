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
import Fornecedor from './Fornecedor';
import ItensPedido from './ItensPedido';
import ArquivoProduto from './ArquivoProduto';

@Entity('produto')
class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ArquivoProduto, arquivosProdutos => arquivosProdutos.produto)
  arquivosProduto: ArquivoProduto;

  @JoinColumn({ name: 'fornecedor_id' })
  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.produtos, {
    eager: true,
  })
  fornecedor: Fornecedor;

  @JoinColumn({ name: 'fornecedor_id' })
  @OneToMany(() => ItensPedido, itens_pedidos => itens_pedidos.produto)
  itensPedidos: ItensPedido;

  @Column()
  fornecedor_id: string;

  @Column()
  nome: string;

  @Column()
  preco: number;

  @Column()
  status_pedido: boolean;

  @Column()
  estoque_produto: number;

  @Column()
  unidade_medida: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Produto;
