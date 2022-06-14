import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from 'src/schemas/restaurant.schema';

export class CreateResturantDto {
  @ApiProperty({
    required: true,
    description: '이름',
    example: '알렉스',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: '설명',
    example: '맛있는 곳',
  })
  readonly description: string;

  @ApiProperty({
    required: true,
    description: '이메일',
    example: '알렉스@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail({}, {message : 'Please enter correct email address'})
  readonly email: string;

  @ApiProperty({
    required: true,
    description: '전화번호',
    example: 1012345678,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly phoneNo: number;

  @ApiProperty({
    required: true,
    description: '주소',
    example: '서울 강남구',
  })
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty({
    required: true,
    description: '카테고리',
    example: '카테고리',
  })
  @IsNotEmpty()
  @IsEnum(Category, {message : 'Please enter correct category'})
  readonly category: Category;
}
