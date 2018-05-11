'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _imageMock = require('./lib/image-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import logger from '../lib/logger';

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('image-router /images', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_imageMock.removeImageMockProm);

  // let imageToGet;

  describe('POST /images', function () {
    test('should return 200 and new image on successful post', function () {
      return (0, _imageMock.createImageMockProm)().then(function (mockResponse) {
        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + mockResponse.accountMock.token).field('name', 'random image').attach('image', __dirname + '/assets/circle.png').then(function (res) {
          // imageToGet = res.body;
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual('random image');
          expect(res.body._id).toBeTruthy();
          expect(res.body.url).toBeTruthy();
        });
      });
    });
    test('should return 400 on bad request', function () {
      return (0, _imageMock.createImageMockProm)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).attach('image', __dirname + '/assets/circle.png').then(Promise.reject);
      }).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
    test('should return 401 if bad token passed', function () {
      return (0, _imageMock.createImageMockProm)().then(function () {
        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer BADTOKEN').field('name', 'random image').attach('image', __dirname + '/assets/circle.png').then(Promise.reject);
      }).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });

  describe('GET /images/:id', function () {
    test('test should return status 200 and json object', function () {
      return (0, _imageMock.createImageMockProm)().then(function (mockResponse) {
        return _superagent2.default.get(apiUrl + '/images/' + mockResponse.image._id).set('Authorization', 'Bearer ' + mockResponse.accountMock.token).then(function (res) {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(mockResponse.image.name);
          expect(res.body.url).toEqual(mockResponse.image.url);
          expect(res.body.key).toEqual(mockResponse.image.key);
          expect(res.body._id).toEqual(mockResponse.image._id.toString());
        });
      });
    });
    test('test should return status 401 if bad token sent', function () {
      return (0, _imageMock.createImageMockProm)().then(function (mockResponse) {
        return _superagent2.default.get(apiUrl + '/images/' + mockResponse.image._id).set('Authorization', 'Bearer BADTOKEN').then(Promise.reject);
      }).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
    test('test should return status 404 if bad id sent', function () {
      return (0, _imageMock.createImageMockProm)().then(function (mockResponse) {
        return _superagent2.default.get(apiUrl + '/images/BADID').set('Authorization', 'Bearer ' + mockResponse.accountMock.token).then(Promise.reject);
      }).catch(function (err) {
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

  describe('DELETE /images/:id', function () {
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
    test('should return status 204 on successful deletion', function () {
      return (0, _imageMock.createImageMockProm)().then(function (mockResponse) {
        return _superagent2.default.del(apiUrl + '/images/' + mockResponse.image._id).set('Authorization', 'Bearer ' + mockResponse.accountMock.token).then(function (res) {
          expect(res.status).toEqual(204);
        });
      });
    });
    test('should return 401 if bad token passed', function () {
      return (0, _imageMock.createImageMockProm)().then(function (mockResponse) {
        return _superagent2.default.del(apiUrl + '/images/' + mockResponse.image._id).set('Authorization', 'Bearer BADTOKEN');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
    test('should return 404 if bad id passed', function () {
      return (0, _imageMock.createImageMockProm)().then(function (mockResponse) {
        return _superagent2.default.del(apiUrl + '/images/BADID').set('Authorization', 'Bearer ' + mockResponse.accountMock.token);
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(404);
      });
    });
  });
});