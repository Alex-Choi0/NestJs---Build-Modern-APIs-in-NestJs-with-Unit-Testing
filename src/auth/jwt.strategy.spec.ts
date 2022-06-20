import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { JwtStarategy } from './jwt.strategy';
import { User, UserRoles } from './schemas/user.schema';

const mockUser = {
  _id: '62aa80844d3d14bd35db1b11',
  email: 'alex@gmail.com',
  name: 'alex',
  role: UserRoles.USER,
};

const mockJwtStarategy = {
  findById: jest.fn(),
};

describe('JWTStarategy', () => {
  let model: Model<User>;
  let jwtStrategy: JwtStarategy;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'apple';

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        JwtStarategy,
        {
          provide: getModelToken(User.name),
          useValue: mockJwtStarategy,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStarategy>(JwtStarategy);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should be defind', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validates and return the user', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser as any);

      const result = await jwtStrategy.validate({ id: mockUser._id });
      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });
    it('should throw Unauthorized Exception', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      expect(jwtStrategy.validate({ id: mockUser._id })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
