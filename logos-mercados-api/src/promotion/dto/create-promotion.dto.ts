import { IsString, IsNumber, IsDate, IsOptional, IsEnum, IsUUID, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PromotionTargetType } from '../../entities/promotion.entity';

export class CreatePromotionClientDto {
  @IsEnum(PromotionTargetType)
  targetType: PromotionTargetType;

  @IsOptional()
  @IsUUID()
  globalCategoryId?: string;

  @IsOptional()
  @IsUUID()
  clientCategoryId?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;
}

export class CreatePromotionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  bgColor: string;

  @IsString()
  textColor: string;

  @IsNumber()
  discountPercentage: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsUUID()
  clientId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePromotionClientDto)
  promotionClients: CreatePromotionClientDto[];
}
