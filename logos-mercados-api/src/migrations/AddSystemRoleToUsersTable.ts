import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSystemRoleToUsersTable1762006167000 implements MigrationInterface {
    name = 'AddSystemRoleToUsersTable1762006167000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add system_role column to users table
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD "system_role" character varying NOT NULL DEFAULT 'CLIENT'
        `);

        // Create a check constraint to ensure only valid roles are allowed
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD CONSTRAINT "CHK_users_system_role" 
            CHECK (system_role IN ('CLIENT', 'ADMIN', 'SUPER_ADMIN'))
        `);

        // Update existing users to have CLIENT role (they already have it as default)
        await queryRunner.query(`
            UPDATE "users" SET "system_role" = 'CLIENT' WHERE "system_role" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the check constraint
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_users_system_role"
        `);

        // Drop the system_role column
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "system_role"
        `);
    }
}
