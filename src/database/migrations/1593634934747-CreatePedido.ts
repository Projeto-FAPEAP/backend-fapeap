import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreatePedido1593634934747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pedido',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'consumidor_id',
            type: 'uuid',
          },
          {
            name: 'fornecedor_id',
            type: 'uuid',
          },
          {
            name: 'total',
            type: 'numeric',
          },
          {
            name: 'status_pedido',
            type: 'varchar',
          },
          {
            name: 'delivery',
            type: 'boolean',
          },
          {
            name: 'cod_pedido',
            type: 'varchar',
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
    await queryRunner.dropTable('pedido');
  }
}
