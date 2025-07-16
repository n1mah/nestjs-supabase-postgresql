import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; price: number },
  ): Promise<Product> {
    return this.productService.create(body, file);
  }
}
