import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientAndProductTables1764098807585
  implements MigrationInterface
{
  name = 'CreateClientAndProductTables1764098807585';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "time_to_delivery" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "address" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "phone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "email" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "time_to_delivery"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "email"`);
  }
}
