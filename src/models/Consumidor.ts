import { Entity, Column, OneToMany } from 'typeorm';

import Pedido from './Pedido';
import Usuario from './Usuario';
import AvaliacaoFornecedor from './AvaliacaoFornecedor';

@Entity('consumidor')
class Consumidor extends Usuario {
  @OneToMany(() => Pedido, pedidos => pedidos.consumidor)
  pedidos: Pedido[];

  @OneToMany(() => AvaliacaoFornecedor, avaliacoes => avaliacoes.consumidor)
  avaliacoes: AvaliacaoFornecedor[];

  @Column('varchar')
  cpf: string;
}

export default Consumidor;
