'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createImageMockProm, removeImageMockProm } from './lib/image-mock';
// import logger from '../lib/logger';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('image-router /images', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeImageMockProm);

  // let imageToGet;

  describe('POST /images', () => {
    test('should return 200 and new image on successful post', () => {
      return createImageMockProm()
        .then((mockResponse) => {
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${mockResponse.accountMock.token}`)
            .field('name', 'random image')
            .attach('image', `${__dirname}/assets/circle.png`)
            .then((res) => {
              // imageToGet = res.body;
              expect(res.status).toEqual(200);
              expect(res.body.name).toEqual('random image');
              expect(res.body._id).toBeTruthy();
              expect(res.body.url).toBeTruthy();
            });
        });
    });
    test('should return 400 on bad request', () => {
      return createImageMockProm()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .attach('image', `${__dirname}/assets/circle.png`)
            .then(Promise.reject);
        })
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('should return 401 if bad token passed', () => {
      return createImageMockProm()
        .then(() => {
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', 'Bearer BADTOKEN')
            .field('name', 'random image')
            .attach('image', `${__dirname}/assets/circle.png`)
            .then(Promise.reject);
        })
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
  });

  describe('GET /images/:id', () => {
    test('test should return status 200 and json object', () => {
      return createImageMockProm()
        .then((mockResponse) => {
          return superagent.get(`${apiUrl}/images/${mockResponse.image._id}`)
            .set('Authorization', `Bearer ${mockResponse.accountMock.token}`)
            .then((res) => {
              expect(res.status).toEqual(200);
              expect(res.body.name).toEqual(mockResponse.image.name);
              expect(res.body.url).toEqual(mockResponse.image.url);
              expect(res.body.key).toEqual(mockResponse.image.key);
              expect(res.body._id).toEqual(mockResponse.image._id.toString());
            });
        });
    });
    test('test should return status 401 if bad token sent', () => {
      return createImageMockProm()
        .then((mockResponse) => {
          return superagent.get(`${apiUrl}/images/${mockResponse.image._id}`)
            .set('Authorization', 'Bearer BADTOKEN')
            .then(Promise.reject);
        })
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
    test('test should return status 404 if bad id sent', () => {
      return createImageMockProm()
        .then((mockResponse) => {
          return superagent.get(`${apiUrl}/images/BADID`)
            .set('Authorization', `Bearer ${mockResponse.accountMock.token}`)
            .then(Promise.reject);
        })
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });

  // describe('GET /images/:id/metadata', () => {
  //   test('REAL TEST - test should return status 200 and json object', () => {
  //     return createImageMockProm()
  //       .then((mockResponse) => {
  //         return superagent.get(`${apiUrl}/images/${imageToGet._id}/metadata`)
  //           .set('Authorization', `Bearer ${mockResponse.accountMock.token}`)
  //           .then((res) => {
  //             expect(res.status).toEqual(200);
  //           });
  //       });
  //   });
  // });

  describe('DELETE /images/:id', () => {
    // test('REAL TEST - should return status 204 on successful deletion', () => {
    //   return createImageMockProm()
    //     .then((mockResponse) => {
    //       return superagent.del(`${apiUrl}/images/${imageToGet._id}`)
    //         .set('Authorization', `Bearer ${mockResponse.accountMock.token}`)
    //         .then((res) => {
    //           expect(res.status).toEqual(204);
    //         });
    //     });
    // });
    test('should return status 204 on successful deletion', () => {
      return createImageMockProm()
        .then((mockResponse) => {
          return superagent.del(`${apiUrl}/images/${mockResponse.image._id}`)
            .set('Authorization', `Bearer ${mockResponse.accountMock.token}`)
            .then((res) => {
              expect(res.status).toEqual(204);
            });
        });
    });
    test('should return 401 if bad token passed', () => {
      return createImageMockProm()
        .then((mockResponse) => {
          return superagent.del(`${apiUrl}/images/${mockResponse.image._id}`)
            .set('Authorization', 'Bearer BADTOKEN');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(401);
        });
    });
    test('should return 404 if bad id passed', () => {
      return createImageMockProm()
        .then((mockResponse) => {
          return superagent.del(`${apiUrl}/images/BADID`)
            .set('Authorization', `Bearer ${mockResponse.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
});
