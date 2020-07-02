import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateRelacionamentos1593727328260
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'produto',
      new TableForeignKey({
        name: 'FornecedorID',
        columnNames: ['fornecedor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'fornecedor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'pedido',
      new TableForeignKey({
        name: 'ConsumidorID',
        columnNames: ['consumidor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'consumidor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'pedido',
      new TableForeignKey({
        name: 'ProdutoID',
        columnNames: ['produto_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'produto',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'historico_pedido',
      new TableForeignKey({
        name: 'ConsumidorID',
        columnNames: ['consumidor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'consumidor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'avaliacao_fornecedor',
      new TableForeignKey({
        name: 'ConsumidorID',
        columnNames: ['consumidor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'consumidor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'arquivo_produto',
      new TableForeignKey({
        name: 'ArquivoID',
        columnNames: ['arquivo_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'arquivo',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'arquivo_produto',
      new TableForeignKey({
        name: 'ProdutoID',
        columnNames: ['produto_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'produto',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'arquivo_fornecedor',
      new TableForeignKey({
        name: 'ArquivoID',
        columnNames: ['arquivo_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'arquivo',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'arquivo_fornecedor',
      new TableForeignKey({
        name: 'FornecedorID',
        columnNames: ['fornecedor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'fornecedor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('arquivo_fornecedor', 'FornecedorID');
    await queryRunner.dropForeignKey('arquivo_fornecedor', 'ArquivoID');
    await queryRunner.dropForeignKey('arquivo_produto', 'ProdutoID');
    await queryRunner.dropForeignKey('arquivo_produto', 'ArquivoID');
    await queryRunner.dropForeignKey('avaliacao_fornecedor', 'ConsumidorID');
    await queryRunner.dropForeignKey('historico_pedido', 'ConsumidorID');
    await queryRunner.dropForeignKey('pedido', 'ProdutoID');
    await queryRunner.dropForeignKey('pedido', 'ConsumidorID');
    await queryRunner.dropForeignKey('produto', 'FornecedorID');
  }
}
