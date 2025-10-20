import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appCreate } from 'src/app.create';
import { dropDatabase } from 'test/heplers/drop-database.helper';
import { bootstrapNestApplication } from 'test/heplers/bootstrap-nest-application.helper';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication<App>;
  let config: ConfigService;

  beforeEach(async () => {
    // Instantiating the application
    app = await bootstrapNestApplication();
    config = app.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer()).get('/').expect(404);
  // });

  it.todo('/users - Endpoint is public');
  it.todo('/users - firstName is mandatory');
  it.todo('/users - email is mandatory');
  it.todo('/users - password is mandatory');
  it.todo('/users - Valid request successfully creates user');
  it.todo('/users - password is not returned in response');
  it.todo('/users - googleId is not returned in response');
});
