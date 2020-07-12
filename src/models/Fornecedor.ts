import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Produto from './Produto';
import Pedido from './Pedido';
import ArquivoFornecedor from './ArquivoFornecedor';

@Entity('fornecedor')
class Fornecedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Produto, produtos => produtos.fornecedor)
  produtos: Produto;

  @OneToMany(() => Pedido, pedidos => pedidos.fornecedor)
  pedidos: Pedido;

  @OneToMany(() => ArquivoFornecedor, arquivos => arquivos.fornecedor)
  arquivos: ArquivoFornecedor;

  @Column()
  nome_fornecedor: string;

  @Column()
  nome_fantasia: string;

  @Column()
  cpf_cnpj: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  telefone: string;

  @Column()
  telefone_whatsapp: string;

  @Column()
  taxa_delivery: number;

  @Column()
  logradouro: string;

  @Column()
  numero_fornecedor: string;

  @Column()
  bairro: string;

  @Column()
  cep: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Fornecedor;
