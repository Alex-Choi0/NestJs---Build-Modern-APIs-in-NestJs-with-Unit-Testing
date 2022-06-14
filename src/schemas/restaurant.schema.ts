import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum Category {
  FAST_FOOD = 'fast Food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine Dinning',
}

@Schema()
export class Restaurant {
  @Prop()
  @ApiProperty({
    description: '레스토랑 이블',
    example: 'alex1',
  })
  name: string;

  @Prop()
  @ApiProperty({
    description: '레스토랑 설명',
    example: 'good tast',
  })
  description: string;

  @Prop()
  @ApiProperty({
    description: '레스토랑 email',
    example: 'alex1@gmail.com',
  })
  email: string;

  @Prop()
  @ApiProperty({
    description: '레스토랑 전화번호',
    example: 1012345678,
  })
  phoneNo: number;

  @Prop()
  @ApiProperty({
    description: '레스토랑 주소',
    example: '서울 강남구',
  })
  address: string;

  @Prop()
  @ApiProperty({
    description: '레스토랑 카테고리',
    example: 'fast food',
  })
  category: Category;

  @Prop()
  @ApiProperty({
    description: '레스토랑 사진',
    example: ['https:s3//'],
  })
  images?: object[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
