import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Produto from './Produto';
import ArquivoFornecedor from './ArquivoFornecedor';
import Pedido from './Pedido';

@Entity('fornecedor')
class Fornecedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Produto, produtos => produtos.fornecedor)
  produtos: Produto;

  @OneToMany(
    () => ArquivoFornecedor,
    arquivos_fornecedor => arquivos_fornecedor.fornecedor,
  )
  arquivos_fornecedor: ArquivoFornecedor;

  @OneToMany(() => Pedido, pedidos => pedidos.fornecedor)
  pedidos: Pedido;

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
  telfone: string;

  @Column()
  telfone_whatsapp: string;

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
