import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

abstract class Arquivo {
  @PrimaryColumn('varchar')
  id: string;

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
