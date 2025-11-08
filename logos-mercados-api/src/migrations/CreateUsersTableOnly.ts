import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTableOnly1762006166000 implements MigrationInterface {
  name = 'CreateUsersTableOnly1762006166000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "login" character varying(255) NOT NULL,
                "password_hash" character varying(255) NOT NULL,
                "client_id" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_login" UNIQUE ("login"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

    // Enable RLS on the users table
    await queryRunner.query(`ALTER TABLE "users" ENABLE ROW LEVEL SECURITY`);

    // Create policy to allow users to read their own records
    await queryRunner.query(`
            CREATE POLICY "users_select_own" ON "users"
            FOR SELECT USING (id = current_setting('app.current_user_id', true)::uuid)
        `);

    // Create policy to allow users to update their own records
    await queryRunner.query(`
            CREATE POLICY "users_update_own" ON "users"
            FOR UPDATE USING (id = current_setting('app.current_user_id', true)::uuid)
        `);

    // Create policy to allow users to insert their own records (for registration)
    await queryRunner.query(`
            CREATE POLICY "users_insert_own" ON "users"
            FOR INSERT WITH CHECK (id = current_setting('app.current_user_id', true)::uuid)
        `);

    // Create policy to prevent users from deleting their own records (optional security measure)
    await queryRunner.query(`
            CREATE POLICY "users_delete_none" ON "users"
            FOR DELETE USING (false)
        `);

    // Create admin policy that allows full access (you can customize this based on your admin detection logic)
    await queryRunner.query(`
            CREATE POLICY "users_full_access_admin" ON "users"
            FOR ALL USING (current_setting('app.is_admin', true) = 'true')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop policies
    await queryRunner.query(
      `DROP POLICY IF EXISTS "users_select_own" ON "users"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "users_update_own" ON "users"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "users_insert_own" ON "users"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "users_delete_none" ON "users"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "users_full_access_admin" ON "users"`,
    );

    // Disable RLS on the users table
    await queryRunner.query(`ALTER TABLE "users" DISABLE ROW LEVEL SECURITY`);

    // Drop the users table
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
