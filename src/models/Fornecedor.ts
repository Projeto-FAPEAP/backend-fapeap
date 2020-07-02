import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('fornecedor')
class Fornecedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  video_caminho: string;

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
