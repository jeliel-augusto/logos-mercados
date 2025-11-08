import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SystemRole } from './roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  client_id: string;

  @Column({
    type: 'enum',
    enum: SystemRole,
    default: SystemRole.CLIENT,
  })
  system_role: SystemRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
