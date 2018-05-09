'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMockProm } from './lib/account-mock';
import { createPetMockProm, removePetMockProm } from './lib/pet-mock';
import logger from '../lib/logger';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('PET ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removePetMockProm);

  describe('POST /pets', () => {
    test('Should return status 200 and new pet on successful post', () => {
      let accountMock = null;
      return createAccountMockProm()
        .then((mockObject) => {
          accountMock = mockObject;
          return superagent.post(`${apiUrl}/pets`)
            .set('Authorization', `Bearer ${mockObject.token}`)
            .send({
              name: 'Zeus',
              type: 'Dog',
            });
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.account).toEqual(accountMock.account._id.toString());
          expect(res.body.name).toEqual('Zeus');
          expect(res.body.type).toEqual('Dog');
        });
    });
    test('Should return status 400 when no authorization sent', () => {
      return createAccountMockProm()
        .then(() => {
          return superagent.post(`${apiUrl}/pets`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('Should return status 401 when sending bad token', () => {
      return createAccountMockProm()
        .then(() => {
          return superagent.post(`${apiUrl}/pets`)
            .set('Authorization', 'Bearer BADTOKEN');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
  });

  describe('GET /pets', () => {
    test('should return status 200 and pet matching the mock created', () => {
      let petMock = null;
      return createPetMockProm()
        .then((mockObject) => {
          petMock = mockObject.pet;
          return superagent.get(`${apiUrl}/pets/${mockObject.pet._id}`)
            .set('Authorization', `Bearer ${mockObject.accountObject.token}`);
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(petMock.name);
          expect(res.body.type).toEqual(petMock.type);
          expect(res.body._id).toEqual(petMock._id.toString());
          logger.log(logger.INFO, res.body);
        });
    });
    test('should return status 400 if no authorization sent', () => {
      return createPetMockProm()
        .then((mockObject) => {
          return superagent.get(`${apiUrl}/pets/${mockObject.pet._id}`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('should return status 401 if passed invalid token', () => {
      return createPetMockProm()
        .then((mockObject) => {
          return superagent.get(`${apiUrl}/pets/${mockObject.pet._id}`)
            .set('Authorization', 'Bearer BADTOKEN');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
    test('should return status 404 if pet not found at id', () => {
      return createPetMockProm()
        .then((mockObject) => {
          return superagent.get(`${apiUrl}/pets/BADID`)
            .set('Authorization', `Bearer ${mockObject.accountObject.token}`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
});
