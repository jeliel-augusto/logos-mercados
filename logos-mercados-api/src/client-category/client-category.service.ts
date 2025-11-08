import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientCategory } from '../entities/client-category.entity';

export interface CreateClientCategoryDto {
  name: string;
  client_id: string;
}

@Injectable()
export class ClientCategoryService {
  constructor(
    @InjectRepository(ClientCategory)
    private readonly clientCategoryRepository: Repository<ClientCategory>,
  ) {}

  async create(
    createClientCategoryDto: CreateClientCategoryDto,
  ): Promise<ClientCategory> {
    const clientCategory = this.clientCategoryRepository.create(
      createClientCategoryDto,
    );
    return this.clientCategoryRepository.save(clientCategory);
  }

  async findAll(): Promise<ClientCategory[]> {
    return this.clientCategoryRepository.find();
  }

  async findOne(id: string): Promise<ClientCategory | null> {
    return this.clientCategoryRepository.findOne({ where: { id } });
  }
}
