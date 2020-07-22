import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterColumnPrecoProduto1595442112394
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('produto', 'preco');
    await queryRunner.addColumn(
      'produto',
      new TableColumn({
        name: 'preco',
        type: 'money',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('produto', 'preco');
  }
}
