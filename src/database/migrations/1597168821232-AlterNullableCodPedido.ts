import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterNullableCodPedido1597168821232 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pedido', 'cod_pedido');
    await queryRunner.addColumn(
      'pedido',
      new TableColumn({
        name: 'cod_pedido',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pedido', 'cod_pedido');
    await queryRunner.addColumn(
      'pedido',
      new TableColumn({
        name: 'cod_pedido',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
