import { Entity, Column, OneToMany } from 'typeorm';
import Produto from './Produto';
import Pedido from './Pedido';
import ArquivoFornecedor from './ArquivoFornecedor';
import Usuario from './Usuario';

@Entity('fornecedor')
class Fornecedor extends Usuario {
  @OneToMany(() => Produto, produtos => produtos.fornecedor)
  produtos: Produto;

  @OneToMany(() => Pedido, pedidos => pedidos.fornecedor)
  pedidos: Pedido;

  @OneToMany(() => ArquivoFornecedor, arquivos => arquivos.fornecedor)
  arquivos: ArquivoFornecedor;

  @Column()
  nome_fantasia: string;

  @Column()
  cpf_cnpj: string;

  @Column()
  telefone: string;

  @Column()
  taxa_delivery: number;
}

export default Fornecedor;
