import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import Fornecedor from './Fornecedor';
import Arquivo from './Arquivo';

@Entity('arquivo_fornecedor')
class ArquivoFornecedor extends Arquivo {
  @JoinColumn({ name: 'fornecedor_id' })
  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.arquivos, {
    eager: true,
  })
  fornecedor: Fornecedor;

  @Column('uuid')
  fornecedor_id: string;
}

export default ArquivoFornecedor;
