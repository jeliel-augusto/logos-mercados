import { TypeOrmModule } from '@nestjs/typeorm';

export const testDbConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT!, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE_E2E || 'logos_mercados_e2e',
  autoLoadEntities: true,
  synchronize: true,
  migrationsRun: false,
  entities: ['src/**/*.entity.ts'],
});
