import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateClientAndProductTables1735736800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create clients table
    await queryRunner.createTable(
      new Table({
        name: 'client',
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
            length: '255',
          },
          {
            name: 'logo_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'theme_color_primary',
            type: 'varchar',
            length: '7',
            isNullable: true,
          },
          {
            name: 'theme_color_secondary',
            type: 'varchar',
            length: '7',
            isNullable: true,
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

    // Create products table
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'client_id',
            type: 'uuid',
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

    // Create foreign key constraint
    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedTableName: 'client',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create index on client_id for better performance
    await queryRunner.createIndex(
      'product',
      new TableIndex({
        name: 'IDX_PRODUCT_CLIENT_ID',
        columnNames: ['client_id'],
      }),
    );

    // Enable Row Level Security on product table
    await queryRunner.query(`ALTER TABLE "product" ENABLE ROW LEVEL SECURITY`);

    // Create RLS policy for product table
    // This policy ensures users can only access products belonging to their client
    await queryRunner.query(`
      CREATE POLICY "client_isolation_policy" ON "product"
      FOR ALL
      TO PUBLIC
      USING (client_id = current_setting('app.current_client_id', true)::uuid)
      WITH CHECK (client_id = current_setting('app.current_client_id', true)::uuid)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policy first
    await queryRunner.query(
      `DROP POLICY IF EXISTS "client_isolation_policy" ON "product"`,
    );

    // Drop foreign key and index
    await queryRunner.dropTable('product');
    await queryRunner.dropTable('client');
  }
}
