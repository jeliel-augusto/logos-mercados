import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreatePromotionsTables1762662210223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create promotions table
    await queryRunner.createTable(
      new Table({
        name: 'promotion',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'bg_color',
            type: 'varchar',
            length: '7', // hex color
          },
          {
            name: 'text_color',
            type: 'varchar',
            length: '7', // hex color
          },
          {
            name: 'discount_percentage',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'start_date',
            type: 'timestamp',
          },
          {
            name: 'end_date',
            type: 'timestamp',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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

    // Create promotion_client table
    await queryRunner.createTable(
      new Table({
        name: 'promotion_client',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'promotion_id',
            type: 'uuid',
          },
          {
            name: 'target_type',
            type: 'enum',
            enum: ['all_products', 'global_category', 'client_category', 'specific_products'],
          },
          {
            name: 'global_category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'client_category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'product_id',
            type: 'uuid',
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

    // Create foreign key for promotion.client_id
    await queryRunner.createForeignKey(
      'promotion',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'client',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key for promotion_client.promotion_id
    await queryRunner.createForeignKey(
      'promotion_client',
      new TableForeignKey({
        columnNames: ['promotion_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'promotion',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key for promotion_client.global_category_id
    await queryRunner.createForeignKey(
      'promotion_client',
      new TableForeignKey({
        columnNames: ['global_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'global_category',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key for promotion_client.client_category_id
    await queryRunner.createForeignKey(
      'promotion_client',
      new TableForeignKey({
        columnNames: ['client_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'client_category',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key for promotion_client.product_id
    await queryRunner.createForeignKey(
      'promotion_client',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes for promotion table
    await queryRunner.createIndex(
      'promotion',
      new TableIndex({
        name: 'IDX_PROMOTION_CLIENT_ID',
        columnNames: ['client_id'],
      }),
    );

    await queryRunner.createIndex(
      'promotion',
      new TableIndex({
        name: 'IDX_PROMOTION_IS_ACTIVE',
        columnNames: ['is_active'],
      }),
    );

    await queryRunner.createIndex(
      'promotion',
      new TableIndex({
        name: 'IDX_PROMOTION_DATES',
        columnNames: ['start_date', 'end_date'],
      }),
    );

    // Create indexes for promotion_client table
    await queryRunner.createIndex(
      'promotion_client',
      new TableIndex({
        name: 'IDX_PROMOTION_CLIENT_PROMOTION_ID',
        columnNames: ['promotion_id'],
      }),
    );

    await queryRunner.createIndex(
      'promotion_client',
      new TableIndex({
        name: 'IDX_PROMOTION_CLIENT_TARGET_TYPE',
        columnNames: ['target_type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('promotion_client');
    await queryRunner.dropTable('promotion');
  }
}
