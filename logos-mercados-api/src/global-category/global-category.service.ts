import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalCategory } from '../entities/global-category.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class GlobalCategoryService {
  constructor(
    @InjectRepository(GlobalCategory)
    private readonly globalCategoryRepository: Repository<GlobalCategory>,
  ) {}

  async findAll(): Promise<GlobalCategory[]> {
    return this.globalCategoryRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<GlobalCategory | null> {
    return this.globalCategoryRepository.findOne({
      where: { id, is_active: true },
    });
  }

  async findOneWithProducts(
    id: string,
    page: number = 1,
  ): Promise<{
    globalCategory: GlobalCategory;
    products: (Product & {
      clientCategory: {
        id: string;
        name: string;
        client: any;
      };
    })[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    hasMore: boolean;
  } | null> {
    const globalCategory = await this.globalCategoryRepository.findOne({
      where: { id, is_active: true },
    });

    if (!globalCategory) {
      return null;
    }

    // Buscar contagem total de produtos
    const totalProductsQuery = await this.globalCategoryRepository
      .createQueryBuilder('globalCategory')
      .leftJoin('globalCategory.clientCategories', 'clientCategory')
      .leftJoin('clientCategory.products', 'product')
      .where('globalCategory.id = :id', { id })
      .andWhere('globalCategory.is_active = :isActive', { isActive: true })
      .getCount();

    // Buscar produtos paginados
    const clientCategoriesWithProducts = await this.globalCategoryRepository
      .createQueryBuilder('globalCategory')
      .leftJoinAndSelect('globalCategory.clientCategories', 'clientCategory')
      .leftJoinAndSelect('clientCategory.products', 'product')
      .leftJoinAndSelect('product.client', 'client')
      .where('globalCategory.id = :id', { id })
      .andWhere('globalCategory.is_active = :isActive', { isActive: true })
      .orderBy('product.created_at', 'DESC')
      .skip((page - 1) * 50)
      .take(50)
      .getMany();

    // Extrair todos os produtos das client categories
    const products: (Product & {
      clientCategory: {
        id: string;
        name: string;
        client: any;
      };
    })[] = [];
    if (clientCategoriesWithProducts) {
      for (const clientCategory of clientCategoriesWithProducts) {
        if (clientCategory.clientCategories) {
          for (const category of clientCategory.clientCategories) {
            if (category.products) {
              for (const product of category.products) {
                products.push({
                  ...product,
                  clientCategory: {
                    id: category.id,
                    name: category.name,
                    client: category.client,
                  },
                });
              }
            }
          }
        }
      }
    }

    const totalPages = Math.ceil(totalProductsQuery / 50);
    const hasMore = page < totalPages;

    return {
      globalCategory,
      products,
      pagination: {
        page,
        limit: 50,
        total: totalProductsQuery,
        totalPages,
      },
      hasMore,
    };
  }

  async create(
    createGlobalCategoryDto: Partial<GlobalCategory>,
  ): Promise<GlobalCategory> {
    const globalCategory = this.globalCategoryRepository.create(
      createGlobalCategoryDto,
    );
    return this.globalCategoryRepository.save(globalCategory);
  }

  async update(
    id: string,
    updateGlobalCategoryDto: Partial<GlobalCategory>,
  ): Promise<GlobalCategory | null> {
    await this.globalCategoryRepository.update(id, updateGlobalCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.globalCategoryRepository.update(id, { is_active: false });
  }

  async findByIconName(iconName: string): Promise<GlobalCategory | null> {
    return this.globalCategoryRepository.findOne({
      where: { icon_name: iconName, is_active: true },
    });
  }
}
