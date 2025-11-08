import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderProductDto {
  @IsUUID()
  product_id: string;

  @IsPositive()
  quantity: number;

  @IsPositive()
  total_value: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  whatsapp_contact: string;

  @IsUUID()
  client_id: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  order_products: CreateOrderProductDto[];
}
