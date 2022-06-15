import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from 'src/schemas/restaurant.schema';

export class UpdateResturantDto {
  @ApiProperty({
    required: false,
    description: '이름',
    example: '알렉스',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    required: false,
    description: '설명',
    example: '맛있는 곳',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    required: false,
    description: '이메일',
    example: '알렉스@gmail.com',
  })
  @IsEmail({}, { message: 'Please enter correct email address' })
  @IsOptional()
  readonly email?: string;

  @ApiProperty({
    required: false,
    description: '전화번호',
    example: 1012345678,
  })
  @IsNumber()
  @IsOptional()
  readonly phoneNo?: number;

  @ApiProperty({
    required: false,
    description: '주소',
    example: '서울 강남구',
  })
  @IsString()
  @IsOptional()
  readonly address?: string;

  @ApiProperty({
    required: false,
    description: '카테고리',
    example: 'Fine Dinning',
  })
  @IsEnum(Category, { message: 'Please enter correct category' })
  @IsOptional()
  readonly category?: Category;

  @IsEmpty({ message: 'You cannot provide the user ID.' })
  readonly user: User;
}
