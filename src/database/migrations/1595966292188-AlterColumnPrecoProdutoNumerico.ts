import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterColumnPrecoProdutoNumerico1595966292188
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
