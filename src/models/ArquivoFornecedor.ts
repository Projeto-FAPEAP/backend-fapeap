import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Fornecedor from './Fornecedor';
import Arquivo from './Arquivo';

@Entity('arquivo_fornecedor')
class ArquivoFornecedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'fornecedor_id' })
  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.arquivos_fornecedor, {
    eager: true,
  })
  fornecedor: Fornecedor;

  @JoinColumn({ name: 'arquivo_id' })
  @ManyToOne(() => Arquivo, arquivo => arquivo.arquivo_fornecedor, {
    eager: true,
  })
  arquivo: Arquivo;

  @Column()
  fornecedor_id: string;

  @Column()
  arquivo_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ArquivoFornecedor;
