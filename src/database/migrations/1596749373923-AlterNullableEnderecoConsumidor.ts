import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterNullableEnderecoConsumidor1596749373923
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('consumidor', 'logradouro');
    await queryRunner.dropColumn('consumidor', 'bairro');
    await queryRunner.dropColumn('consumidor', 'cep');
    await queryRunner.dropColumn('consumidor', 'numero_local');
    await queryRunner.addColumn(
      'consumidor',
      new TableColumn({
        name: 'logradouro',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'consumidor',
      new TableColumn({
        name: 'bairro',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'consumidor',
      new TableColumn({
        name: 'cep',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'consumidor',
      new TableColumn({
        name: 'numero_local',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('consumidor', 'logradouro');
    await queryRunner.addColumn(
      'consumidor',
      new TableColumn({
        name: 'logradouro',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'consumidor',
      new TableColumn({
        name: 'bairro',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'consumidor',
      new TableColumn({
        name: 'cep',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'consumidor',
      new TableColumn({
        name: 'numero_local',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
