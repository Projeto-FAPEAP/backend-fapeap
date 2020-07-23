import { Entity, Column, OneToMany } from 'typeorm';

import Pedido from './Pedido';
import Usuario from './Usuario';

@Entity('consumidor')
class Consumidor extends Usuario {
  @OneToMany(() => Pedido, pedidos => pedidos.consumidor)
  pedidos: Pedido[];

  @Column('varchar')
  cpf: string;
}

export default Consumidor;
