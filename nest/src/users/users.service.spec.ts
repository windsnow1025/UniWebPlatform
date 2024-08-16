import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../common/enums/role.enum';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    mockRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    mockRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should return a new user', async () => {
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(mockRepository, 'save').mockImplementation(async (user) => {
        return Object.assign(new User(), user);
      });

      const username = 'test-user';
      const password = 'test-password';

      const user = await usersService.create(username, password);

      expect(user).toEqual(
        expect.objectContaining({
          username: 'test-user',
          roles: [Role.User],
        }),
      );
    });
  });
});
