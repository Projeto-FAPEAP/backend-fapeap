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

  @OneToMany(() => ArquivoProduto, arquivos => arquivos.produto)
  arquivos: ArquivoProduto[];

  @OneToMany(() => ItensPedido, itens_pedidos => itens_pedidos.produto)
  itens_pedidos: ItensPedido[];

  @JoinColumn({ name: 'fornecedor_id' })
  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.produtos, {
    eager: true,
  })
  fornecedor: Fornecedor;

  @Column('uuid')
  fornecedor_id: string;

  @Column('varchar')
  nome: string;

  @Column('numeric')
  preco: number;

  @Column('boolean')
  status_produto: boolean;

  @Column('integer')
  estoque_produto: number;

  @Column('varchar')
  unidade_medida: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Produto;
