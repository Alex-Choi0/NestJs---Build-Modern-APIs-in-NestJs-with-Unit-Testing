import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/schemas/restaurant.schema';

export class CreateResturantDto {
  @ApiProperty({
    required: true,
    description: '이름',
    example: '알렉스',
  })
  readonly name: string;

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
  readonly email: string;

  @ApiProperty({
    required: true,
    description: '전화번호',
    example: 1012345678,
  })
  readonly phoneNo: number;

  @ApiProperty({
    required: true,
    description: '주소',
    example: '서울 강남구',
  })
  readonly address: string;

  @ApiProperty({
    required: true,
    description: '카테고리',
    example: '카테고리',
  })
  readonly category: Category;
}
