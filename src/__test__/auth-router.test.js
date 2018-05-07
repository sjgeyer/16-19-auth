'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeAccountMockProm, createAccountMockProm } from './lib/account-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('AUTH router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMockProm);

  describe('POST', () => {
    test('200 and TOKEN', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.lorem.word(),
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeTruthy();
        });
    });
    test('400', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({
          username: faker.internet.userName(),
          email: '',
          password: faker.lorem.word(),
        })
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
    test('409', () => {
      return createAccountMockProm()
        .then((mockObject) => {
          return superagent.post(`${apiUrl}/signup`)
            .send({
              username: faker.internet.userName(),
              email: mockObject.account.email,
              password: faker.lorem.word(),
            });
        })
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(409);
        });
    });
    test('500', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({})
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(500);
        });
    });
  });
});
