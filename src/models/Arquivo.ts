import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import ArquivoFornecedor from './ArquivoFornecedor';
import ArquivoProduto from './ArquivoProduto';

@Entity('arquivo')
class Arquivo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(
    () => ArquivoFornecedor,
    arquivo_fornecedor => arquivo_fornecedor.arquivo,
  )
  arquivo_fornecedor: ArquivoFornecedor;

  @OneToOne(() => ArquivoProduto, arquivoProduto => arquivoProduto.arquivo)
  arquivoProduto: ArquivoProduto;

  @Column()
  arquivo_referencia: string;

  @Column()
  mimetype: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Arquivo;
