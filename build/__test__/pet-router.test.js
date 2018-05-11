'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _petMock = require('./lib/pet-mock');

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('PET ROUTER', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_petMock.removePetMockProm);

  describe('POST /pets', function () {
    test('Should return status 200 and new pet on successful post', function () {
      var accountMock = null;
      return (0, _accountMock.createAccountMockProm)().then(function (mockObject) {
        accountMock = mockObject;
        return _superagent2.default.post(apiUrl + '/pets').set('Authorization', 'Bearer ' + mockObject.token).send({
          name: 'Zeus',
          type: 'Dog'
        });
      }).then(function (res) {
        expect(res.status).toEqual(200);
        expect(res.body.account).toEqual(accountMock.account._id.toString());
        expect(res.body.name).toEqual('Zeus');
        expect(res.body.type).toEqual('Dog');
      });
    });
    test('Should return status 400 when no authorization sent', function () {
      return (0, _accountMock.createAccountMockProm)().then(function () {
        return _superagent2.default.post(apiUrl + '/pets');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
    test('Should return status 401 when sending bad token', function () {
      return (0, _accountMock.createAccountMockProm)().then(function () {
        return _superagent2.default.post(apiUrl + '/pets').set('Authorization', 'Bearer BADTOKEN');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });

  describe('GET /pets', function () {
    test('should return status 200 and pet matching the mock created', function () {
      var petMock = null;
      return (0, _petMock.createPetMockProm)().then(function (mockObject) {
        petMock = mockObject.pet;
        return _superagent2.default.get(apiUrl + '/pets/' + mockObject.pet._id).set('Authorization', 'Bearer ' + mockObject.accountObject.token);
      }).then(function (res) {
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(petMock.name);
        expect(res.body.type).toEqual(petMock.type);
        expect(res.body._id).toEqual(petMock._id.toString());
        _logger2.default.log(_logger2.default.INFO, res.body);
      });
    });
    test('should return status 400 if no authorization sent', function () {
      return (0, _petMock.createPetMockProm)().then(function (mockObject) {
        return _superagent2.default.get(apiUrl + '/pets/' + mockObject.pet._id);
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
    test('should return status 401 if passed invalid token', function () {
      return (0, _petMock.createPetMockProm)().then(function (mockObject) {
        return _superagent2.default.get(apiUrl + '/pets/' + mockObject.pet._id).set('Authorization', 'Bearer BADTOKEN');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
    test('should return status 404 if pet not found at id', function () {
      return (0, _petMock.createPetMockProm)().then(function (mockObject) {
        return _superagent2.default.get(apiUrl + '/pets/BADID').set('Authorization', 'Bearer ' + mockObject.accountObject.token);
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(404);
      });
    });
  });
});