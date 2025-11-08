import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';

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

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    
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
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }
}
