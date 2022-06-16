import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from 'src/auth/schemas/user.schema';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { CreateResturantDto } from './dto/create-restaurant.dto';
import { UpdateResturantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@ApiTags('Restaurant')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  // @UseGuards(AuthGuard())
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
  @ApiBearerAuth()
  async getAllRestaurants(
    @Query() query: ExpressQuery,
    @CurrentUser() user: User, // use customdecorator to check user infomation
  ): Promise<Restaurant[]> {
    console.log('get user info by customdecorator : ', user);
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
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  @ApiOperation({
    summary: 'create a restaurant',
    description: '레스트로랑을 생성한다',
  })
  @ApiBearerAuth()
  async createRestaurant(
    @Body() restaurant: CreateResturantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant, user);
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
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  @ApiOperation({
    description: '레스트로랑 업데이트 하기',
    summary: 'update restaurant',
  })
  @ApiParam({ name: 'id', example: '62a81f1564a7181cda257c71' })
  @ApiBearerAuth()
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateResturantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    const res = await this.restaurantsService.findById(id);
    if (res.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this restaurant.');
    return await this.restaurantsService.updateById(id, restaurant);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  @ApiParam({
    name: 'id',
    example: '62a81f1564a7181cda257c71',
    description: '삭제할 레스트로랑의 id',
  })
  @ApiBearerAuth()
  async deleteRestaurant(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: Boolean }> {
    const restaurant = await this.restaurantsService.findById(id);
    if (restaurant.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this restaurant.');
    console.log('Deleting Restaurant : ', restaurant);
    const isDeleted = await this.restaurantsService.deleteImages(
      restaurant.images,
    );
    if (isDeleted) {
      const res = await this.restaurantsService.deleteById(id);
      return {
        deleted: true,
      };
    } else {
      return {
        deleted: false,
      };
    }
  }

  @Put('upload/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  @ApiOperation({ summary: '파일을 서버쪽으로 upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBearerAuth()
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    const restaurant = await this.restaurantsService.findById(id);
    if (restaurant.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this restaurant.');
    const res = await this.restaurantsService.uploadImages(id, files);
    return res;
  }
}
