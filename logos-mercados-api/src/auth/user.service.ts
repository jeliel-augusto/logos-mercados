import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PasswordUtils } from '../utils/password.utils';

export interface CreateUserDto {
  name: string;
  login: string;
  password: string;
  client_id?: string;
}

interface UserWithPassword extends Omit<User, 'password_hash'> {
  password_hash: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    const { name, login, password, client_id } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { login },
    });
    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    // Hash the password
    const passwordHash = await PasswordUtils.hash(password);

    // Create new user
    const user = this.userRepository.create({
      name,
      login,
      password_hash: passwordHash,
      client_id,
    });

    const savedUser = await this.userRepository.save(user);

    // Remove password hash from response
    const { password_hash: _passwordHash, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'login', 'name', 'client_id', 'created_at', 'updated_at'],
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { login },
      select: [
        'id',
        'login',
        'name',
        'password_hash',
        'client_id',
        'created_at',
        'updated_at',
      ],
    });
  }
}
