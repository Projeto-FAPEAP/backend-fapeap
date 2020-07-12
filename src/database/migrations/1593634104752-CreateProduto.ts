import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateProduto1593634104752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'produto',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'fornecedor_id',
            type: 'uuid',
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'preco',
            type: 'decimal',
            precision: 2,
          },
          {
            name: 'status_produto',
            type: 'boolean',
          },
          {
            name: 'estoque_produto',
            type: 'integer',
          },
          {
            name: 'unidade_medida',
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
    await queryRunner.dropTable('produto');
  }
}
