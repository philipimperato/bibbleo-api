import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from './../src/app/auth/auth.controller';
import { AuthModule } from './../src/app/auth/auth.module';
import { Server } from 'http';
import { CreateUserDto } from './../src/app/users/dto/create-user.dto';

describe('Auth e2e', () => {
  let server: Server;
  let app: INestApplication;

  const user = {
    email: 'testuser@bibbleo.com',
    password: 'testuser',
    firstname: 'Test',
    lastname: 'User',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule, AuthModule],
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
    const controller = app.get<AuthController>(AuthController);
    expect(controller).toBeDefined();
  });

  it('Checks for access/refresh tokens [POST]', async () => {
    await request(server)
      .post('/auth/register')
      .send(user as CreateUserDto)
      .expect(HttpStatus.CREATED);

    return request(server)
      .post('/auth')
      .send({
        email: 'testuser@bibbleo.com',
        password: 'testuser',
      })
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.accessToken).toBeDefined();
        expect(body.refreshToken).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
