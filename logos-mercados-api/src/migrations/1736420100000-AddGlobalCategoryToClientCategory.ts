import { MigrationInterface, QueryRunner, TableIndex, TableForeignKey, Index } from 'typeorm';

export class AddGlobalCategoryToClientCategory1736420100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE client_category 
      ADD COLUMN global_category_id UUID NULL;
    `);

    await queryRunner.createForeignKey(
      'client_category',
      new TableForeignKey({
        columnNames: ['global_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'global_category',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'client_category',
      new TableIndex({
        name: 'IDX_CLIENT_CATEGORY_GLOBAL_CATEGORY_ID',
        columnNames: ['global_category_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('client_category', 'IDX_CLIENT_CATEGORY_GLOBAL_CATEGORY_ID');
    
    const table = await queryRunner.getTable('client_category');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('global_category_id') !== -1,
    );
    
    if (foreignKey) {
      await queryRunner.dropForeignKey('client_category', foreignKey);
    }

    await queryRunner.query(`
      ALTER TABLE client_category 
      DROP COLUMN global_category_id;
    `);
  }
}
