import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import Fornecedor from './Fornecedor';
import Produto from './Produto';

@Entity('arquivo')
class Arquivo {
  @PrimaryColumn('varchar')
  id: string;

  @JoinColumn({ name: 'produto_id' })
  @ManyToOne(() => Produto, produto => produto.arquivos, {
    eager: true,
  })
  produto: Produto;

  @JoinColumn({ name: 'fornecedor_id' })
  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.arquivos, {
    eager: true,
  })
  fornecedor: Fornecedor;

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

export default Arquivo;
