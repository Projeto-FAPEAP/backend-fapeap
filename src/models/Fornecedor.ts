import { Entity, Column, OneToMany } from 'typeorm';
import Produto from './Produto';
import ArquivoFornecedor from './ArquivoFornecedor';
import Usuario from './Usuario';
import Pedido from './Pedido';

@Entity('fornecedor')
class Fornecedor extends Usuario {
  @OneToMany(() => Produto, produtos => produtos.fornecedor)
  produtos: Produto[];

  @OneToMany(() => Pedido, pedidos => pedidos.fornecedor)
  pedidos: Pedido[];

  @OneToMany(() => ArquivoFornecedor, arquivos => arquivos.fornecedor)
  arquivos: ArquivoFornecedor[];

  @Column('varchar')
  nome_fantasia: string;

  @Column('varchar')
  cpf_cnpj: string;

  @Column('varchar')
  telefone: string;

  @Column('numeric')
  taxa_delivery: number;

  @Column()
  verificado: boolean;
}

export default Fornecedor;
