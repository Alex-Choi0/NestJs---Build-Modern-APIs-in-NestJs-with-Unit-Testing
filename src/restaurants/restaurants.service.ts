import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Restaurant } from 'src/schemas/restaurant.schema';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { UpdateResturantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all Restaurants => GET /restaurants
  async findAll(query: Query): Promise<Restaurant[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const restaurants = await this.restaurantModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);

    return restaurants;
  }

  // Create new Restaurant => POST /restaurants
  async create(restaurant: Restaurant, user: User): Promise<Restaurant> {
    console.log('addrsess : ', restaurant.address);
    const Location = await APIFeatures.getRestaurantLocation(
      restaurant.address,
    );
    console.log('Location Info : ', Location);
    const data = Object.assign(restaurant, { user: user._id, Location });
    console.log('data :', data);
    const res = await this.restaurantModel.create(data);
    return res;
  }

  // Get a restaurant by ID => GET /restaurant/:id
  async findById(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    console.log('isValidId : ', isValidId);
    if (!isValidId)
      throw new BadRequestException(
        'Wrong mongoose ID Error, Please enter correct ID',
      );

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

  // Upload Images => PUT /restaurants/upload/:id
  async uploadImages(id, files) {
    const images = await APIFeatures.upload(files);

    console.log('Upload Images to AWS S3 Bucket : ', images);
    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        images: images as Object[],
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return restaurant;
  }

  async deleteImages(images) {
    if (images.length === 0) return true;
    const res = await APIFeatures.deleteImages(images);
    return res;
  }
}
