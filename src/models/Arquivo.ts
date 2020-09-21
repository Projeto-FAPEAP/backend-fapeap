import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

abstract class Arquivo {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  nome_original: string;

  @Column('bigint')
  size: number;

  @Column('varchar')
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Arquivo;
