import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import Fornecedor from './Fornecedor';
import Arquivo from './Arquivo';

@Entity('arquivo_fornecedor')
class ArquivoFornecedor extends Arquivo {
  @JoinColumn({ name: 'fornecedor_id' })
  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.arquivos, {
    eager: true,
  })
  fornecedor: Fornecedor;
}

export default ArquivoFornecedor;
