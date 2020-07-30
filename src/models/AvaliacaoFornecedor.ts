import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Fornecedor from './Fornecedor';
import Consumidor from './Consumidor';

@Entity('avaliacao_fornecedor')
class AvaliacaoFornecedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Consumidor, consumidor => consumidor.avaliacoes)
  @JoinColumn({ name: 'consumidor_id' })
  consumidor: Consumidor;

  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.avaliacoes)
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;

  @Column('uuid')
  consumidor_id: string;

  @Column('uuid')
  fornecedor_id: string;

  @Column('integer')
  estrelas: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default AvaliacaoFornecedor;
