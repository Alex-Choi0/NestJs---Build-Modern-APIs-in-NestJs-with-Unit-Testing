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
};

describe('RestaurantService', () => {
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
});
