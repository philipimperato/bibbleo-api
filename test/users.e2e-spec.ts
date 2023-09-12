import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './../src/app/users/users.controller';
import { UsersModule } from './../src/app/users/users.module';
import { Server } from 'http';
import { CreateUserDto } from './../src/app/users/dto/create-user.dto';

describe('Users e2e', () => {
  let server: Server;
  let app: INestApplication;

  const user = {
    email: 'test-user@bibbleo.com',
    password: 'testuser',
    firstname: 'Test',
    lastname: 'User',
  };

  const createdUser = expect.objectContaining({
    ...user,
    password: expect.not.stringMatching('testuser'),
    status: expect.stringMatching('active'),
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [UsersModule, ConfigModule],
          useFactory: async () => {
            return {
              dialect: 'postgres',
              host: 'localhost',
              port: 5433,
              username: 'postgres',
              password: 'e2e@testdb',
              database: 'postgres',
              autoLoadModels: true,
              synchronize: true,
              logging: false,
            };
          },
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        transform: true,
      }),
    );

    server = app.getHttpServer();
    await app.init();
  });

  it('should be defined', () => {
    const controller = app.get<UsersController>(UsersController);
    expect(controller).toBeDefined();
  });

  it('/POST create a user', () => {
    return request(server)
      .post('/users')
      .send(user as CreateUserDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(createdUser).toMatchObject(body);
      });
  });

  it('GET /users get request with $skip & $limit', () => {
    return request(server)
      .get('/users?$limit=10&$skip=1')
      .expect(200)
      .expect((res: any) => {
        const { data, $limit, $skip, total } = res._body;

        expect(Array.isArray(data)).toBe(true);
        expect($limit).toBeGreaterThanOrEqual(1);
        expect($skip).toBeGreaterThanOrEqual(1);
        expect(total).toBeDefined();
      });
  });

  it('GET /users insure pagination defaults are working', () => {
    return request(server)
      .get('/users')
      .expect(200)
      .expect((res: any) => {
        const { $limit, $skip } = res._body;

        expect($limit).toBe(10);
        expect($skip).toBe(1);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
