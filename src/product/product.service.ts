import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.request';

@Injectable()
export class ProductService {
  private supabase: SupabaseClient;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async create(
    productData: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    let image: string | null = null;

    if (file) image = await this.supabaseService.uploadBucketImages(file);

    const product = this.productRepository.create({
      ...productData,
      image,
    } as Partial<Product>);
    return this.productRepository.save(product);
  }
}
