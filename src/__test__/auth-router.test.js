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

  describe('POST /signup', () => {
    test('Should return status 200 and TOKEN on successful post', () => {
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
    test('Should return status 400 when no email sent', () => {
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
    test('Should return status 409 when duplicate email attempted', () => {
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
    test('Should return status 500 when no information sent', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({})
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(500);
        });
    });
  });

  describe('GET /login', () => {
    test('Should return status 200 and TOKEN on successful get', () => {
      return createAccountMockProm()
        .then((mockObject) => {
          return superagent.get(`${apiUrl}/login`)
            .auth(mockObject.request.username, mockObject.request.password);
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeTruthy();
        });
    });
    test('Should return status 400 when no password sent', () => {
      return createAccountMockProm()
        .then((mockObject) => {
          return superagent.get(`${apiUrl}/login`)
            .auth(mockObject.request.username, '');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('Should return status 400 when no authorization sent', () => {
      return createAccountMockProm()
        .then(() => {
          return superagent.get(`${apiUrl}/login`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });
});
