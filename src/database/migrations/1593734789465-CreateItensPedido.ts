import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateItensPedido1593734789465
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'itens_pedido',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'produto_id',
            type: 'uuid',
          },
          {
            name: 'pedido_id',
            type: 'uuid',
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
