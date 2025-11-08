import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
