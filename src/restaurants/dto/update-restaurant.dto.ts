import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/schemas/restaurant.schema';

export class UpdateResturantDto {
  @ApiProperty({
    required: false,
    description: '이름',
    example: '알렉스',
  })
  readonly name?: string;

  @ApiProperty({
    required: false,
    description: '설명',
    example: '맛있는 곳',
  })
  readonly description?: string;

  @ApiProperty({
    required: false,
    description: '이메일',
    example: '알렉스@gmail.com',
  })
  readonly email?: string;

  @ApiProperty({
    required: false,
    description: '전화번호',
    example: 1012345678,
  })
  readonly phoneNo?: number;

  @ApiProperty({
    required: false,
    description: '주소',
    example: '서울 강남구',
  })
  readonly address?: string;

  @ApiProperty({
    required: false,
    description: '카테고리',
    example: '카테고리',
  })
  readonly category?: Category;
}
