import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('avaliacao_fornecedor')
class AvaliacaoFornecedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  estrelas: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default AvaliacaoFornecedor;
