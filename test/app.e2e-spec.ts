import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let service: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();

    service = moduleFixture.get<AppService>(AppService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('App Service should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
