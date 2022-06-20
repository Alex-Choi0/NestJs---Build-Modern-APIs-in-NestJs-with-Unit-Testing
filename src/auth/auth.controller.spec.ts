import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRoles } from './schemas/user.schema';

const mockUser = {
  _id: '62abdcee43d3177dfa9714cb',
  email: 'alex@gmail.com',
  name: 'alex',
  role: UserRoles.USER,
};

const signUpDto = {
  name: mockUser.name,
  email: mockUser.email,
  password: 'password',
};

const loginDto = {
  email: mockUser.email,
  password: signUpDto.password,
};

const mockAuthService = {
  signUp: jest.fn(),
  login: jest.fn(),
};

const token = 'hashToken';

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should signup a user', async () => {
      jest
        .spyOn(service, 'signUp')
        .mockImplementationOnce(() => Promise.resolve({ token }));

      const { name, email } = mockUser;

      const result = await controller.signUpDto({
        name,
        email,
        password: 'password',
      });

      expect(result).toEqual({ token });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      jest
        .spyOn(service, 'login')
        .mockImplementationOnce(() => Promise.resolve({ token }));
      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
  });
});
