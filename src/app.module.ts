import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './app/users/users.module';
import sequelizeConfig from './sequelize.config';
import { DefaultQueryPagination } from './middleware/default-query-pagination';
import { AuthModule } from './app/auth/auth.module';
import { AuthController } from './app/auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [sequelizeConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // insure $limit/$skip are populated
    consumer.apply(DefaultQueryPagination).forRoutes('*');
  }
}