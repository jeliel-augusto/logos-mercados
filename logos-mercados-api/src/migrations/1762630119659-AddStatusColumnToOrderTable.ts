import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusColumnToOrderTable1762630119659
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for order status
    await queryRunner.query(`
      CREATE TYPE "order_status_enum" AS ENUM (
        'CREATED',
        'ACCEPTED', 
        'IN_DELIVERY',
        'CONCLUDED'
      )
    `);

    // Add status column to order table
    await queryRunner.query(`
      ALTER TABLE "order" 
      ADD COLUMN "status" "order_status_enum" NOT NULL DEFAULT 'CREATED'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop status column from order table
    await queryRunner.query(`
      ALTER TABLE "order" 
      DROP COLUMN "status"
    `);

    // Drop enum type
    await queryRunner.query(`
      DROP TYPE "order_status_enum"
    `);
  }
}
