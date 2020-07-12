import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import Produto from './Produto';

@Entity('arquivo_produto')
class ArquivoProduto {
  @PrimaryColumn('varchar')
  id: string;

  @JoinColumn({ name: 'produto_id' })
  @ManyToOne(() => Produto, produto => produto.arquivos, {
    eager: true,
  })
  produto: Produto;

  @Column()
  nome_original: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ArquivoProduto;
