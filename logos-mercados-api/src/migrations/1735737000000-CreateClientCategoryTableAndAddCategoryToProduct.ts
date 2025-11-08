import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateClientCategoryTableAndAddCategoryToProduct1735737000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create client_category table
    await queryRunner.createTable(
      new Table({
        name: 'client_category',
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

    // Add category_id column to product table
    await queryRunner.query(`
      ALTER TABLE "product" 
      ADD COLUMN "category_id" UUID
    `);

    // Create foreign key for client_category table
    await queryRunner.createForeignKey(
      'client_category',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedTableName: 'client',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key for product table (category_id)
    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'client_category',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Create index for performance
    await queryRunner.createIndex(
      'client_category',
      new TableIndex({
        name: 'IDX_CLIENT_CATEGORY_CLIENT_ID',
        columnNames: ['client_id'],
      }),
    );

    await queryRunner.createIndex(
      'product',
      new TableIndex({
        name: 'IDX_PRODUCT_CATEGORY_ID',
        columnNames: ['category_id'],
      }),
    );

    // Enable Row Level Security on client_category table
    await queryRunner.query(
      `ALTER TABLE "client_category" ENABLE ROW LEVEL SECURITY`,
    );

    // Create RLS policy for client_category table
    await queryRunner.query(`
      CREATE POLICY "client_category_client_isolation_policy" ON "client_category"
      FOR ALL
      TO PUBLIC
      USING (client_id = current_setting('app.current_client_id', true)::uuid)
      WITH CHECK (client_id = current_setting('app.current_client_id', true)::uuid)
    `);

    // Update existing RLS policy for product table to include category filtering
    await queryRunner.query(`
      DROP POLICY IF EXISTS "client_isolation_policy" ON "product"
    `);

    await queryRunner.query(`
      CREATE POLICY "client_isolation_policy" ON "product"
      FOR ALL
      TO PUBLIC
      USING (client_id = current_setting('app.current_client_id', true)::uuid)
      WITH CHECK (client_id = current_setting('app.current_client_id', true)::uuid)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies first
    await queryRunner.query(
      `DROP POLICY IF EXISTS "client_category_client_isolation_policy" ON "client_category"`,
    );

    // Drop foreign key and column from product table
    const productTable = await queryRunner.getTable('product');
    const categoryForeignKey = productTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('category_id') !== -1,
    );
    if (categoryForeignKey) {
      await queryRunner.dropForeignKey('product', categoryForeignKey);
    }

    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category_id"`);

    // Drop client_category table
    await queryRunner.dropTable('client_category');
  }
}
