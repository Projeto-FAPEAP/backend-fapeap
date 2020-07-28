import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterColumnPrecoProdutoNumeric1595963382705
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('produto', 'preco');
    await queryRunner.addColumn(
      'produto',
      new TableColumn({
        name: 'preco',
        type: 'numeric',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('produto', 'preco');
  }
}
