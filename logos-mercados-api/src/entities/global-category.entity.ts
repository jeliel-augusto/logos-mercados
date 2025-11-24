import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientCategory } from './client-category.entity';

@Entity()
export class GlobalCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'icon_name', nullable: true })
  icon_name?: string;

  @Column({ name: 'display_order', default: 0 })
  display_order: number;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @OneToMany(() => ClientCategory, (clientCategory) => clientCategory.globalCategory)
  clientCategories: ClientCategory[];
}
