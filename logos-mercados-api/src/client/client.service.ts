import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { ClientCategory } from '../entities/client-category.entity';
import { Product } from '../entities/product.entity';

export interface CreateClientDto {
  name: string;
  logo_url?: string;
  theme_color_primary?: string;
  theme_color_secondary?: string;
}

export interface UpdateClientDto {
  name?: string;
  logo_url?: string;
  theme_color_primary?: string;
  theme_color_secondary?: string;
}

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ClientCategory)
    private readonly clientCategoryRepository: Repository<ClientCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Check if client with same name already exists
    const existingClient = await this.clientRepository.findOne({
      where: { name: createClientDto.name },
    });

    if (existingClient) {
      throw new ConflictException('Client with this name already exists');
    }

    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: string): Promise<any> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Get client categories
    const categories = await this.clientCategoryRepository.find({
      where: { client_id: id },
    });

    // Get products for each category
    const groupedCategories = await Promise.all(
      categories.map(async (category) => {
        const products = await this.productRepository.find({
          where: {
            client_id: id,
            category_id: category.id,
          },
        });

        return {
          category: category.name,
          products: products,
        };
      }),
    );

    return {
      ...client,
      categories: groupedCategories,
    };
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Check if updating name and it conflicts with existing client
    if (updateClientDto.name && updateClientDto.name !== client.name) {
      const existingClient = await this.clientRepository.findOne({
        where: { name: updateClientDto.name },
      });

      if (existingClient) {
        throw new ConflictException('Client with this name already exists');
      }
    }

    Object.assign(client, updateClientDto);
    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    await this.clientRepository.remove(client);
  }
}
