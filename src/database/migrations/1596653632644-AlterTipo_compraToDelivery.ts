import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterTipoCompraToDelivery1596653632644
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pedido', 'tipo_da_compra');
    await queryRunner.addColumn(
      'pedido',
      new TableColumn({
        name: 'delivery',
        type: 'boolean',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pedido', 'delivery');
    await queryRunner.addColumn(
      'pedido',
      new TableColumn({
        name: 'tipo_da_compra',
        type: 'boolean',
      }),
    );
  }
}
