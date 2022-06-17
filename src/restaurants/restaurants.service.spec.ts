import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserRoles } from 'src/auth/schemas/user.schema';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { Restaurant } from '../schemas/restaurant.schema';
import { RestaurantsService } from './restaurants.service';

const mockRestaurant = [
  {
    _id: '62aa971eb4dee91fdde004fd',
    name: '알렉스',
    description: '맛있는 곳',
    email: '알렉스@gmail.com',
    phoneNo: 1012345678,
    address: '125 Hawdon Ct, Howlong NSW 2643 Australia',
    category: 'Fine Dinning',
    images: [],
    menu: [],
    user: '62aa80844d3d14bd35db1b11',
    createdAt: '2022-06-16T02:36:14.525Z',
    updatedAt: '2022-06-16T06:56:29.276Z',
    __v: 13,
  },
  {
    _id: '62abd470e7704c8ace267af1',
    name: '알렉스1',
    description: '맛있는 곳',
    email: '알렉스1@gmail.com',
    phoneNo: 10122345678,
    address: '125 Hawdon Ct, Howlong NSW 2643 Australia',
    category: 'Fine Dinning',
    images: [],
    user: '62aa80844d3d14bd35db1b11',
    menu: [],
    createdAt: '2022-06-17T01:10:08.489Z',
    updatedAt: '2022-06-17T01:10:08.489Z',
    __v: 0,
  },
];
[
  {
    _id: '62abda0824106567bd7e545d',
    name: '알렉스1',
    description: '맛있는 곳',
    email: '알렉스3@gmail.com',
    phoneNo: 101315678,
    address: '119 Hawkins St, Howlong NSW 2643 Australia',
    category: 'Fine Dinning',
    images: [],
    Location: {
      type: 'Point',
      coordinates: [146.6354, -35.98074],
      formattedAddress: '119 Hawkins Street, Howlong, New South Wales 2643, AU',
      city: 'Howlong',
      countryCode: 'AU',
      zipcode: '2643',
    },
    user: '62aa80844d3d14bd35db1b11',
    menu: [],
    createdAt: '2022-06-17T01:34:00.102Z',
    updatedAt: '2022-06-17T01:34:00.102Z',
    __v: 0,
  },
  {
    _id: '62abdcee43d3177dfa9714cb',
    name: '알렉스',
    description: '맛있는 곳',
    email: '알렉스@gmail.com',
    phoneNo: 101315679,
    address: '125 Hawdon Ct Howlong NSW 2643 Australia',
    category: 'Fine Dinning',
    images: [],
    Location: {
      type: 'Point',
      coordinates: [146.6359, -35.98241],
      formattedAddress: '125 Hawdon Court, Howlong, New South Wales 2643, AU',
      city: 'Howlong',
      countryCode: 'AU',
      zipcode: '2643',
    },
    user: '62aa80844d3d14bd35db1b11',
    menu: [],
    createdAt: '2022-06-17T01:46:22.725Z',
    updatedAt: '2022-06-17T01:46:22.725Z',
    __v: 0,
  },
];

const mockRestaurantUpdateInput = {
  name: 'alex',
  description: 'nothing',
  email: null,
  phoneNo: null,
  address: null,
  category: null,
  user: null,
};

const mockRestaurantUpdate = {
  _id: '62aa971eb4dee91fdde004fd',
  name: 'alex',
  description: '맛있는 곳',
  email: '알렉스@gmail.com',
  phoneNo: 1012345678,
  address: '125 Hawdon Ct, Howlong NSW 2643 Australia',
  category: 'Fine Dinning',
  images: [],
  menu: [],
  user: '62aa80844d3d14bd35db1b11',
  createdAt: '2022-06-16T02:36:14.525Z',
  updatedAt: '2022-06-16T06:56:29.276Z',
  __v: 13,
};

const mockUser = {
  _id: '62abdcee43d3177dfa9714cb',
  email: 'alex@gmail.com',
  name: 'alex',
  role: UserRoles.USER,
};

const mockRestaurantLocation = {
  type: 'Point',
  coordinates: [146.6354, -35.98074],
  formattedAddress: '119 Hawkins Street, Howlong, New South Wales 2643, AU',
  city: 'Howlong',
  countryCode: 'AU',
  zipcode: '2643',
};

// 실제 코드에서 Mongoose Module함수를 Mock한다
const mockRestaurantService = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteImage: jest.fn(),
};

describe('RestaurantService', () => {
  const mongooseService = {
    isValidObjectId: jest.fn(),
  };
  let service: RestaurantsService;
  let model: Model<Restaurant>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should get all restaurants', async () => {
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockRestaurant]),
            }),
          } as any),
      );

      const restaurants = await service.findAll({ keyword: 'restaurant' });
      expect(restaurants).toEqual([mockRestaurant]);
    });
  });

  describe('create', () => {
    const newRestaurant = {
      _id: '62abdcee43d3177dfa9714cb',
      name: '알렉스',
      description: '맛있는 곳',
      email: '알렉스@gmail.com',
      phoneNo: 101315679,
      address: '125 Hawdon Ct Howlong NSW 2643 Australia',
      category: 'Fine Dinning',
    };

    it('should create a new restaurant', async () => {
      jest
        .spyOn(APIFeatures, 'getRestaurantLocation')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurantLocation));
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant[0]));
      const result = await service.create(
        newRestaurant as any,
        mockUser as any,
      );
      expect(result).toEqual(mockRestaurant[0]);
    });
  });

  // Try myself
  // describe('create', () => {
  //   it('should get Location Info', async () => {
  //     jest.spyOn(APIFeatures, 'getRestaurantLocation').mockImplementation(
  //       () =>
  //         ({
  //           getRestaurantLocation: jest
  //             .fn((x) => x)
  //             .mockResolvedValue(mockRestaurantLocation),
  //         } as any),
  //     );
  //     const Location = await APIFeatures.getRestaurantLocation(
  //       '119 Hawkins St, Howlong NSW 2643 Australia',
  //     );
  //     expect(Location).toEqual(mockRestaurantLocation);
  //   });
  // });

  describe('RestaurantService', () => {
    it('should get restaurant by Id', async () => {
      jest
        .spyOn(model, 'findById')
        .mockResolvedValueOnce(mockRestaurant[0] as any);

      const result = await service.findById(mockRestaurant[0]._id);

      expect(result).toEqual(mockRestaurant[0]);
    });

    it('shoud throw wrong mongoose id error', async () => {
      await expect(service.findById('abcde')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw restaurant not from error', async () => {
      const mockError = new NotFoundException('Restaurant not found');
      jest.spyOn(model, 'findById').mockRejectedValue(mockError);

      await expect(service.findById(mockRestaurant[0]._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  // Try by my self
  // describe('findById', () => {
  //   it('should find restaurant by id', async () => {
  //     jest
  //       .spyOn(mongoose, 'isValidObjectId')
  //       .mockImplementationOnce(() => Promise.resolve(true));
  //     jest
  //       .spyOn(model, 'findById')
  //       .mockImplementationOnce(() => Promise.resolve(mockRestaurant[0]));

  //     const result = await service.findById(mockRestaurant[0]['_id']);
  //     expect(result).toEqual(mockRestaurant[0]);
  //   });
  // });

  describe('updateById', () => {
    it('should update the restaurant', async () => {
      const restaurant = { ...mockRestaurant[0], name: 'Updated name' };
      const updateData = { name: 'Updated name' };
      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(restaurant as any);

      const updateRestaurant = await service.updateById(
        restaurant._id,
        updateData as any,
      );
      expect(updateRestaurant).toEqual(restaurant);
    });
  });

  // Try by myself(Working)
  // describe('updateById', () => {
  //   it('should get update restaurant', async () => {
  //     jest
  //       .spyOn(model, 'findByIdAndUpdate')
  //       .mockResolvedValueOnce(mockRestaurantUpdate);

  //     const result = await service.updateById(
  //       mockRestaurant[0]._id,
  //       mockRestaurantUpdateInput,
  //     );
  //     expect(result).toEqual(mockRestaurantUpdate);
  //   });
  // });

  describe('deleteById', () => {
    it('should delete the restaurant', async () => {
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockResolvedValueOnce(mockRestaurant[0]);
      const result = await service.deleteById(mockRestaurant[0]._id);
      expect(result).toEqual(mockRestaurant[0]);
    });
  });

  // Try by myself(Working)
  // describe('deleteById', () => {
  //   it('should delete restaurant by id', async () => {
  //     jest
  //       .spyOn(model, 'findByIdAndDelete')
  //       .mockResolvedValueOnce(mockRestaurant[0]._id);
  //     const result = await service.deleteById(mockRestaurant[0]._id);
  //     expect(result).toEqual(mockRestaurant[0]._id);
  //   });
  // });

  describe('uploadImage', () => {
    it('should upload restaurant images on S3 Bucket', async () => {
      const mockImage = [
        {
          ETag: '"7e9c06bf20fa9607af5b9b65f387770e"',
          Location:
            'https://nestjs-restaurant.s3.amazonaws.com/restaurants/AWS_NeedToEnter_1655452695375.png',
          key: 'restaurants/AWS_NeedToEnter_1655452695375.png',
          Key: 'restaurants/AWS_NeedToEnter_1655452695375.png',
          Bucket: 'nestjs-restaurant',
        },
      ];

      const files = [
        {
          fieldname: 'files',
          originalname: 'image1.jpeg',
          encoding: '7bit',
          mimtype: 'image/jpeg',
          buffer: '<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 >',
          size: 19128,
        },
      ];

      const updatedRestaurant = { ...mockRestaurant[0], images: mockImage };

      jest.spyOn(APIFeatures, 'upload').mockResolvedValueOnce(mockImage);

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(updatedRestaurant as any);

      const result = await service.uploadImages(mockRestaurant[0]._id, files);
      expect(result).toEqual(updatedRestaurant);
    });
  });

  describe('deleteImages', () => {
    it('should delete restaurant images from S3 Bucket', async () => {
      const mockImage = [
        {
          ETag: '"7e9c06bf20fa9607af5b9b65f387770e"',
          Location:
            'https://nestjs-restaurant.s3.amazonaws.com/restaurants/AWS_NeedToEnter_1655452695375.png',
          key: 'restaurants/AWS_NeedToEnter_1655452695375.png',
          Key: 'restaurants/AWS_NeedToEnter_1655452695375.png',
          Bucket: 'nestjs-restaurant',
        },
      ];

      jest.spyOn(APIFeatures, 'deleteImages').mockResolvedValueOnce(true);

      const result = await service.deleteImages(mockImage);
      expect(result).toEqual(true);
    });
  });
});
