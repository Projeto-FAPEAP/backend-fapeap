import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import Produto from './Produto';
import Arquivo from './Arquivo';

@Entity('arquivo_produto')
class ArquivoProduto extends Arquivo {
  @JoinColumn({ name: 'produto_id' })
  @ManyToOne(() => Produto, produto => produto.arquivos, {
    eager: true,
  })
  produto: Produto;

  @Column('uuid')
  produto_id: string;
}

export default ArquivoProduto;
