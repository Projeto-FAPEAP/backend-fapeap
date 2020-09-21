import { Entity, Column, OneToMany } from 'typeorm';
import Produto from './Produto';
import ArquivoFornecedor from './ArquivoFornecedor';
import Usuario from './Usuario';
import Pedido from './Pedido';
import AvaliacaoFornecedor from './AvaliacaoFornecedor';

@Entity('fornecedor')
class Fornecedor extends Usuario {
  @OneToMany(() => Produto, produtos => produtos.fornecedor)
  produtos: Produto[];

  @OneToMany(() => Pedido, pedidos => pedidos.fornecedor)
  pedidos: Pedido[];

  @OneToMany(() => ArquivoFornecedor, arquivos => arquivos.fornecedor)
  arquivos: ArquivoFornecedor[];

  @OneToMany(() => AvaliacaoFornecedor, avaliacoes => avaliacoes.fornecedor)
  avaliacoes: AvaliacaoFornecedor[];

  @Column('varchar')
  nome_fantasia: string;

  @Column('varchar')
  cpf_cnpj: string;

  @Column('varchar')
  telefone: string;

  @Column('numeric')
  taxa_delivery: number | null;

  @Column()
  verificado: boolean;

  @Column('varchar')
  status_aprovado: string;

  @Column('varchar')
  cidade: string;

  @Column('varchar')
  uf: string;

  @Column('varchar')
  latitude: string;

  @Column('varchar')
  longitude: string;
}

export default Fornecedor;
