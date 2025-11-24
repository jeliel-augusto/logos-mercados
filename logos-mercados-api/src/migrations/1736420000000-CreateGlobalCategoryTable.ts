import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateGlobalCategoryTable1736420000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'global_category',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'icon_name',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'int',
            default: 0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes usando TableIndex
    await queryRunner.createIndex(
      'global_category',
      new TableIndex({
        name: 'IDX_GLOBAL_CATEGORY_DISPLAY_ORDER',
        columnNames: ['display_order'],
      }),
    );

    await queryRunner.createIndex(
      'global_category',
      new TableIndex({
        name: 'IDX_GLOBAL_CATEGORY_IS_ACTIVE',
        columnNames: ['is_active'],
      }),
    );

    // Insert default global categories
    await queryRunner.query(`
      INSERT INTO global_category (name, description, icon_name, display_order) VALUES
      ('Frutas', 'Frutas frescas e tropicais', 'AppleIcon', 1),
      ('Carnes', 'Carnes bovinas, suínas e aves', 'BeefIcon', 2),
      ('Padaria', 'Pães, bolos e confeitaria', 'CakeIcon', 3),
      ('Laticínios', 'Leites, queijos e derivados', 'MilkIcon', 4),
      ('Mercearia', 'Grãos, massas e enlatados', 'PackageIcon', 5),
      ('Hortifruti', 'Verduras e legumes frescos', 'ShoppingBasketIcon', 6);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('global_category');
  }
}
