import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateOrderAndOrderProductTables1735736900000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create orders table
    await queryRunner.createTable(
      new Table({
        name: 'order',
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
            name: 'requested_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'accepted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'whatsapp_contact',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'location_lat',
            type: 'decimal',
            precision: 10,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'location_long',
            type: 'decimal',
            precision: 11,
            scale: 8,
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

    // Create order_product table
    await queryRunner.createTable(
      new Table({
        name: 'order_product',
        columns: [
          {
            name: 'order_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'product_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'total_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
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

    // Create foreign keys for order table
    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedTableName: 'client',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for order_product table
    await queryRunner.createForeignKey(
      'order_product',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'order',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order_product',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes for performance
    await queryRunner.createIndex(
      'order',
      new TableIndex({
        name: 'IDX_ORDER_CLIENT_ID',
        columnNames: ['client_id'],
      }),
    );

    await queryRunner.createIndex(
      'order',
      new TableIndex({
        name: 'IDX_ORDER_REQUESTED_AT',
        columnNames: ['requested_at'],
      }),
    );

    await queryRunner.createIndex(
      'order',
      new TableIndex({
        name: 'IDX_ORDER_LOCATION',
        columnNames: ['location_lat', 'location_long'],
      }),
    );

    await queryRunner.createIndex(
      'order_product',
      new TableIndex({
        name: 'IDX_ORDER_PRODUCT_ORDER_ID',
        columnNames: ['order_id'],
      }),
    );

    await queryRunner.createIndex(
      'order_product',
      new TableIndex({
        name: 'IDX_ORDER_PRODUCT_PRODUCT_ID',
        columnNames: ['product_id'],
      }),
    );

    // Enable Row Level Security on order table
    await queryRunner.query(`ALTER TABLE "order" ENABLE ROW LEVEL SECURITY`);

    // Create RLS policy for order table
    await queryRunner.query(`
      CREATE POLICY "order_client_isolation_policy" ON "order"
      FOR ALL
      TO PUBLIC
      USING (client_id = current_setting('app.current_client_id', true)::uuid)
      WITH CHECK (client_id = current_setting('app.current_client_id', true)::uuid)
    `);

    // Enable Row Level Security on order_product table
    await queryRunner.query(`ALTER TABLE "order_product" ENABLE ROW LEVEL SECURITY`);

    // Create RLS policy for order_product table
    await queryRunner.query(`
      CREATE POLICY "order_product_client_isolation_policy" ON "order_product"
      FOR ALL
      TO PUBLIC
      USING (order_id IN (
        SELECT id FROM "order" 
        WHERE client_id = current_setting('app.current_client_id', true)::uuid
      ))
      WITH CHECK (order_id IN (
        SELECT id FROM "order" 
        WHERE client_id = current_setting('app.current_client_id', true)::uuid
      ))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies first
    await queryRunner.query(
      `DROP POLICY IF EXISTS "order_product_client_isolation_policy" ON "order_product"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "order_client_isolation_policy" ON "order"`,
    );

    // Drop tables
    await queryRunner.dropTable('order_product');
    await queryRunner.dropTable('order');
  }
}
