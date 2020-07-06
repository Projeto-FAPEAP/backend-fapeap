import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Produto from './Produto';
import Arquivo from './Arquivo';

@Entity('arquivo_produto')
class ArquivoProduto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'produto_id' })
  @ManyToOne(() => Produto, produto => produto.arquivosProduto, {
    eager: true,
  })
  produto: Produto;

  @JoinColumn({ name: 'arquivo_id' })
  @OneToOne(() => Arquivo, arquivo => arquivo.arquivoProduto, {
    eager: true,
  })
  arquivo: Arquivo;

  @Column()
  fornecedor_id: string;

  @Column()
  arquivo_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ArquivoProduto;
