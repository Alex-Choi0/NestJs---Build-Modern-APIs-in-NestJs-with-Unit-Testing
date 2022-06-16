import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealService } from './meal.service';
import { Meal } from './schemas/meal.schema';

@ApiTags('Meal')
@Controller('meal')
export class MealController {
  constructor(private mealService: MealService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Menu',
    description: '등록되 있는 모든 음식을 출력한다.',
  })
  async getAllMeals(): Promise<Meal[]> {
    return this.mealService.findAll();
  }

  @Get('/restaurant/:id')
  @ApiOperation({
    summary: 'Get All Menu from restaurant id',
    description: '레스트로랑에 등록되 있는 모든 음식을 출력한다.',
  })
  @ApiParam({
    description: '레스트로랑 id',
    name: 'id',
    example: '62aa971eb4dee91fdde004fd',
  })
  async getMealsByRestaurant(@Param('id') id: string): Promise<Meal[]> {
    return this.mealService.findByRestaurant(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Menu',
    description: '레스트로랑 음식 생성',
  })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  createMeal(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    console.log('create meal user : ', user);
    return this.mealService.create(createMealDto, user);
  }

  @Get('/mealId/:id')
  @ApiOperation({
    summary: 'Get Menu by mealId',
    description: 'mealId로 음식 1개 출력하기',
  })
  @ApiParam({
    description: '음식 id',
    name: 'id',
    example: '62aa971eb4dee91fdde004fd',
  })
  async getMeal(@Param('id') id: string): Promise<Meal> {
    return await this.mealService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Update a meal data',
    description: 'mealId로 음식1개 수정하기',
  })
  @ApiParam({
    description: '음식 id',
    name: 'id',
    example: '62aa971eb4dee91fdde004fd',
  })
  @ApiBearerAuth()
  async updateMeal(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDto,
    @CurrentUser() user: User,
  ) {
    console.log('meal ID : ', id);
    const meal = await this.mealService.findById(id);
    console.log('find by id');
    if (meal.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this meal.');
    return await this.mealService.updateById(id, updateMealDto);
  }

  @Delete(':id')
  @ApiParam({
    description: '삭제할 음식 id',
    name: 'id',
    example: '62aa971eb4dee91fdde004fd',
  })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async deleteMeal(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: Boolean }> {
    console.log('meal ID : ', id);
    const meal = await this.mealService.findById(id);
    console.log('find by id');
    if (meal.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this meal.');

    return await this.mealService.deleteById(id);
  }
}
