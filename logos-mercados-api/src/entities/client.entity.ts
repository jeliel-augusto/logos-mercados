import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ name: 'theme_color_primary', nullable: true })
  theme_color_primary: string;

  @Column({ name: 'theme_color_secondary', nullable: true })
  theme_color_secondary: string;

  @Column({ nullable: true })
  time_to_delivery: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  updated_at: Date;
}
