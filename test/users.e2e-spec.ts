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

  it('Controller should be defined', () => {
    const controller = app.get<UsersController>(UsersController);
    expect(controller).toBeDefined();
  });

  it('Creates a user [POST]', () => {
    return request(server)
      .post('/users')
      .send(user as CreateUserDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.password).not.toBe('testuser');
        expect(body.createdAt).toBeDefined();
      });
  });

  it('Unable to create a user with existing email [POST]', async () => {
    const duplicateUser = {
      email: 'test-user@bibbleo.com',
      password: 'testuser',
      firstname: 'Test',
      lastname: 'User',
    };

    try {
      await request(server)
        .post('/users')
        .send(duplicateUser as CreateUserDto)
        .expect(400);
    } catch (e) {
      console.log(e);
    }
  });

  it('Users request with $skip & $limit [GET]', () => {
    return request(server)
      .get('/users?$limit=10&$skip=1')
      .expect(200)
      .expect(({ body }) => {
        const { data, $limit, $skip, total } = body;

        expect(Array.isArray(data)).toBe(true);
        expect($limit).toBeGreaterThanOrEqual(1);
        expect($skip).toBeGreaterThanOrEqual(1);
        expect(total).toBeDefined();
      });
  });

  it('Users request without $skip and $limit [GET]', () => {
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
