import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import Fornecedor from './Fornecedor';

@Entity('arquivo_fornecedor')
class Arquivo {
  @PrimaryColumn('varchar')
  id: string;

  @JoinColumn({ name: 'fornecedor_id' })
  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.arquivos, {
    eager: true,
  })
  fornecedor: Fornecedor;

  @Column()
  nome_original: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Arquivo;
