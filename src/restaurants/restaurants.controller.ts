import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { CreateResturantDto } from './dto/create-restaurant.dto';
import { UpdateResturantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@ApiTags('Restaurant')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({
    summary: 'call all the restaurant',
    description: '모든 레스트로랑을 불러온다',
  })
  @ApiQuery({
    description: 'keyword검색',
    name: 'keyword',
    example: 'hello',
  })
  @ApiQuery({
    description: 'keyword검색',
    name: 'page',
    example: '0',
  })
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  // example Body
  /*
  {
    "name": "Returant Prod",
    "description" : "This is just a description",
    "email": "ghulam@gmail.com",
    "phoneNo":"9788246116",
    "category" : "Fast Food",
    "address": "200 Olympic Dr, Stafford, VS, 22554"
  }
  */

  @Post()
  @ApiOperation({
    summary: 'create a restaurant',
    description: '레스트로랑을 생성한다',
  })
  async createRestaurant(
    @Body() restaurant: CreateResturantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant);
  }

  @Get(':id')
  @ApiOperation({
    description: '아이디로 레스트로랑을 찾는다',
    summary: 'find restaurant by id',
  })
  @ApiParam({ name: 'id', example: '62a81f1564a7181cda257c71' })
  async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return await this.restaurantsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({
    description: '레스트로랑 업데이트 하기',
    summary: 'update restaurant',
  })
  @ApiParam({ name: 'id', example: '62a81f1564a7181cda257c71' })
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateResturantDto,
  ): Promise<Restaurant> {
    await this.restaurantsService.findById(id);
    return await this.restaurantsService.updateById(id, restaurant);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: '62a81f1564a7181cda257c71',
    description: '삭제할 레스트로랑의 id',
  })
  async deleteRestaurant(
    @Param('id') id: string,
  ): Promise<{ deleted: Boolean }> {
    await this.restaurantsService.findById(id);
    const res = await this.restaurantsService.deleteById(id);

    if (res) {
      return {
        deleted: true,
      };
    }
  }
}
