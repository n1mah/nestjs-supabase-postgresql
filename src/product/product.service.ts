import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ProductService {
  private supabase: SupabaseClient;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!,
    );
  }

  async create(
    productData: Partial<Product>,
    file?: Express.Multer.File,
  ): Promise<Product> {
    let image: string | null = null;
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;

      const { error } = await this.supabase.storage
        .from('images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw new Error('Upload failed: ' + error.message);
      }

      const { data: urlData } = this.supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      image = urlData.publicUrl;
    }

    const product = this.productRepository.create({
      title: productData.title,
      price: productData.price,
      image,
    } as Partial<Product>);
    return this.productRepository.save(product);
  }
}
