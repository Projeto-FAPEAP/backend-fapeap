import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class Createfornecedor1593626320065
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'fornecedor',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nome_fornecedor',
            type: 'varchar',
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
          },
          {
            name: 'cpf_cnpj',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'senha',
            type: 'varchar',
          },
          {
            name: 'telefone',
            type: 'varchar',
          },
          {
            name: 'telefone_whatsapp',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'taxa_delivery',
            type: 'decimal',
            precision: 2,
            isNullable: true,
          },
          {
            name: 'video_caminho',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'logradouro',
            type: 'varchar',
          },
          {
            name: 'numero_fornecedor',
            type: 'varchar',
          },
          {
            name: 'bairro',
            type: 'varchar',
          },
          {
            name: 'cep',
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
    await queryRunner.dropTable('fornecedor');
  }
}
