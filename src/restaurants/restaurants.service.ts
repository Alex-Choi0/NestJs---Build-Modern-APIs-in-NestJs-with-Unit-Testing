import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { UpdateResturantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all Restaurants => GET /restaurants
  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantModel.find();
    return restaurants;
  }

  // Create new Restaurant => POST /restaurants
  async create(restaurant: Restaurant): Promise<Restaurant> {
    const res = await this.restaurantModel.create(restaurant);
    return res;
  }

  // Get a restaurant by ID => GET /restaurant/:id
  async findById(id: string): Promise<Restaurant> {
    const res = await this.restaurantModel.findById(id);
    if (!res) throw new NotFoundException('Restaurant not found');
    return res;
  }

  // Update a resturant by ID => PUT /restaurants/:id
  async updateById(
    id: string,
    restaurant: UpdateResturantDto,
  ): Promise<Restaurant> {
    console.log('id : ', id);
    console.log('restaurant : ', restaurant);
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }

  // Delete a resturant by ID => DELETE /restaurants/:id
  async deleteById(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndDelete(id);
  }
}
