import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from '../entities/client.entity';
import { ClientCategory } from '../entities/client-category.entity';
import { Product } from '../entities/product.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ClientCategory, Product]),
    AuthModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
