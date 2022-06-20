import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { AuthService } from './auth.service';
import { User, UserRoles } from './schemas/user.schema';

const mockUser = {
  _id: '62abdcee43d3177dfa9714cb',
  email: 'alex@gmail.com',
  name: 'alex',
  role: UserRoles.USER,
};

const token = 'jwtToken';

const mockAuthService = {
  create: jest.fn(),
  findOne: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'apple',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const signUpDto = {
    name: mockUser.name,
    email: mockUser.email,
    password: 'password',
  };

  const loginDto = {
    email: mockUser.email,
    password: signUpDto.password,
  };

  describe('SignUp', () => {
    it('should register a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('testHash');
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));

      jest.spyOn(APIFeatures, 'assignJwtToken').mockResolvedValueOnce(token);

      const result = await service.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });

    it('should throw duplicate email entered', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('password');
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

      await expect(service.signUp(signUpDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('Login', () => {
    it('should login user and return the token', async () => {
      jest.spyOn(model, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(mockUser),
          } as any),
      );
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(APIFeatures, 'assignJwtToken').mockResolvedValueOnce(token);
      // jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.login(loginDto);

      expect(result.token).toEqual(token);

      // // expect(model.findOne).toHaveBeenCalled();
      // expect(bcrypt.compare).toHaveBeenCalled();
      // expect(APIFeatures.assignJwtToken).toHaveBeenCalled();
      // expect(result).toEqual({ token });
    });

    it('should throw invalid user error', async () => {
      jest.spyOn(model, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(null),
          } as any),
      );

      expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(model, 'findOne').mockImplementationOnce(
        () =>
          ({
            select: jest.fn().mockResolvedValueOnce(mockUser),
          } as any),
      );
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
