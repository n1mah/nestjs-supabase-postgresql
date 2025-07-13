import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() body: Partial<Product>): Promise<Product> {
    return this.productService.create(body);
  }
}
