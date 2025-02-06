import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should successfully sign up a new user', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };

      const user = { ...signUpDto, id: 1, password: 'hashedpassword' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // No existing user
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await authService.signup(signUpDto);

      expect(result.message).toBe('User has succesfully created!');
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if user already exists', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };

      const existingUser = { ...signUpDto, id: 1 };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      try {
        await authService.signup(signUpDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('User with this email already exists');
      }
    });
  });

  describe('signin', () => {
    it('should successfully sign in a user and return a token', async () => {
      const signInDto = { email: 'test@example.com', password: 'password' };
      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await authService.signin(signInDto);

      expect(result.token).toBe('token');
      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: user.id,
        email: user.email,
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const signInDto = { email: 'test@example.com', password: 'password' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // User not found

      try {
        await authService.signin(signInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid credentials');
      }
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const signInDto = { email: 'test@example.com', password: 'password' };
      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Incorrect password

      try {
        await authService.signin(signInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid credentials');
      }
    });
  });

  describe('logout', () => {
    it('should successfully log out a user', async () => {
      const token = 'someToken';
      const userId = 1;
      const user = { id: userId, blacklistedTokens: [] };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await authService.logout(token, userId);

      expect(result.message).toBe('User successfully logged out');
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        blacklistedTokens: [token],
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const token = 'someToken';
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      try {
        await authService.logout(token, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('isTokenBlacklisted', () => {
    it('should return true if token is blacklisted', async () => {
      const token = 'someToken';
      const decoded = { userId: 1 };
      const user = { id: 1, blacklistedTokens: [token] };
      jest.spyOn(jwtService, 'decode').mockReturnValue(decoded);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await authService.isTokenBlacklisted(token);

      expect(result).toBe(true);
    });

    it('should return false if token is not blacklisted', async () => {
      const token = 'someToken';
      const decoded = { userId: 1 };
      const user = { id: 1, blacklistedTokens: [] };
      jest.spyOn(jwtService, 'decode').mockReturnValue(decoded);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await authService.isTokenBlacklisted(token);

      expect(result).toBe(false);
    });

    it('should return false if user not found', async () => {
      const token = 'someToken';
      const decoded = { userId: 1 };
      jest.spyOn(jwtService, 'decode').mockReturnValue(decoded);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await authService.isTokenBlacklisted(token);

      expect(result).toBe(false);
    });
  });
});

