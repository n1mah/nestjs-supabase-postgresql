import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber({}, { message: 'price must be a valid number' })
  @Min(0)
  price: number;
}
