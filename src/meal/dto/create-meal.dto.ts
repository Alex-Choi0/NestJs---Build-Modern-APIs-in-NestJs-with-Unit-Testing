import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from '../schemas/meal.schema';

export class CreateMealDto {
  @ApiProperty({
    required: true,
    description: '음식이름',
    example: '탕수육',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    required: true,
    description: '음식설명',
    example: '양만 많음',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    required: true,
    description: '가격',
    example: 5000,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    required: true,
    description: '음식 카테고리',
    example: 'Pasta',
  })
  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category for this meal' })
  readonly category: Category;

  @ApiProperty({
    required: true,
    description: '레스트로랑 아이디',
    example: '62aa80844d3d14bd35db1b11',
  })
  @IsNotEmpty()
  @IsString()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user ID' })
  readonly user: User;
}
