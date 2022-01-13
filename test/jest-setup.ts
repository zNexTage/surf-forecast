import SetupServer from '@src/Server';
import supertest from 'supertest';

beforeAll(() => {
  const server = new SetupServer();

  server.init();

  global.testRequest = supertest(server.getApp());
});
