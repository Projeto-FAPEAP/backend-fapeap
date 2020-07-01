import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateHistoricoPedido1593635960838
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'historico_pedido',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'preco_unidade',
            type: 'numeric',
            precision: 2,
          },
          {
            name: 'quantidade',
            type: 'integer',
          },
          {
            name: 'total',
            type: 'numeric',
            precision: 2,
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
    await queryRunner.dropTable('historico_pedido');
  }
}
