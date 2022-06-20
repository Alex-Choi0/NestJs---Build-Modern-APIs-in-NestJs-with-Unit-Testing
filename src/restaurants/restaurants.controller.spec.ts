import { ForbiddenException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRoles } from 'src/auth/schemas/user.schema';
import { RestaurantsController } from './restaurants.controller';
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
  _id: '62aa80844d3d14bd35db1b11',
  email: 'alex@gmail.com',
  password: '12345',
  name: 'alex',
  role: UserRoles.USER,
};

const mockRestaurantService = {
  findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
  findById: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
  deleteImages: jest.fn(),
  uploadImages: jest.fn(),
};

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get All Restaurant', () => {
    it('should get all restaurants', async () => {
      const result = await controller.getAllRestaurants({ keyword: '알렉스' });
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockRestaurant]);
    });
  });

  describe('createRestaurant', () => {
    it('should create a new restaurant', async () => {
      const newRestaurant = {
        _id: '62abdcee43d3177dfa9714cb',
        name: '알렉스',
        description: '맛있는 곳',
        email: '알렉스@gmail.com',
        phoneNo: 101315679,
        address: '125 Hawdon Ct Howlong NSW 2643 Australia',
        category: 'Fine Dinning',
      };
      mockRestaurantService.create = jest
        .fn()
        .mockResolvedValueOnce(newRestaurant);

      const result = await controller.createRestaurant(
        newRestaurant as any,
        mockUser as any,
      );

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(newRestaurant);
    });
  });

  describe('Get One Restaurant', () => {
    it('should get one restaurant by Id', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant[0]);
      const result = await controller.getRestaurant(mockRestaurant[0]._id);
      expect(service.findById).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant[0]);
    });
  });

  describe('updateRestaurant', () => {
    const restaurant = { ...mockRestaurant[0], name: 'Updated name' };
    const updateRestaurant = { name: 'Updated name' };

    it('should update one restaurant by Id', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant[0]);
      mockRestaurantService.updateById = jest
        .fn()
        .mockResolvedValueOnce(restaurant);
      const result = await controller.updateRestaurant(
        restaurant._id,
        updateRestaurant as any,
        mockUser as any,
      );
      expect(service.updateById).toHaveBeenCalled();
      expect(result).toEqual(restaurant);
      expect(result.name).toEqual(restaurant.name);
    });

    it('should throw forbidden error', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(restaurant);

      await expect(
        controller.updateRestaurant(
          restaurant._id,
          updateRestaurant as any,
          { ...mockUser, _id: 'wrongId' } as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete Restaurant', () => {
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

    it('should throw forbiddenException', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant[0]);
      await expect(
        controller.deleteRestaurant(mockRestaurant[0]._id, {
          ...mockUser,
          _id: 'wrong Id',
        } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should delete restaurant', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant[0]);
      mockRestaurantService.deleteImages = jest
        .fn()
        .mockResolvedValueOnce(true);
      const result = await controller.deleteRestaurant(
        mockRestaurant[0]._id,
        mockUser as any,
      );
      expect(result).toEqual({ deleted: true });
    });

    it('should failed to deleted images', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant[0]);
      mockRestaurantService.deleteImages = jest
        .fn()
        .mockResolvedValueOnce(false);
      const result = await controller.deleteRestaurant(
        mockRestaurant[0]._id,
        mockUser as any,
      );
      expect(result).toEqual({ deleted: false });
    });
  });

  describe('uploadFiles', () => {
    it('should not upload this restaurant images', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant[0]);
      await expect(
        controller.uploadFiles(
          mockRestaurant[0]._id,
          [] as any,
          { ...mockUser, _id: 'wrong Id' } as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should upload this restaurant images', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant[0]);
      mockRestaurantService.uploadImages = jest.fn().mockResolvedValueOnce([]);

      const result = await controller.uploadFiles(
        mockRestaurant[0]._id,
        [],
        mockUser as any,
      );
      expect(service.uploadImages).toHaveBeenCalled();
      expect(result).toStrictEqual([]);
    });
  });
});
