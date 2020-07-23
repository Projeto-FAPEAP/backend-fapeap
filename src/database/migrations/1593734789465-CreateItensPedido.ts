import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateItensPedido1593734789465
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'itens_pedido',
        columns: [
          {
            name: 'produto_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'pedido_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'preco_venda',
            type: 'numeric',
          },
          {
            name: 'quantidade',
            type: 'integer',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('itens_pedido');
  }
}
