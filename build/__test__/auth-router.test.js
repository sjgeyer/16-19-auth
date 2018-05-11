'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('AUTH router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.removeAccountMockProm);

  describe('POST /signup', function () {
    test('Should return status 200 and TOKEN on successful post', function () {
      return _superagent2.default.post(apiUrl + '/signup').send({
        username: _faker2.default.internet.userName(),
        email: _faker2.default.internet.email(),
        password: _faker2.default.lorem.word()
      }).then(function (res) {
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeTruthy();
      });
    });
    test('Should return status 400 when no email sent', function () {
      return _superagent2.default.post(apiUrl + '/signup').send({
        username: _faker2.default.internet.userName(),
        email: '',
        password: _faker2.default.lorem.word()
      }).then(Promise.reject).catch(function (res) {
        expect(res.status).toEqual(400);
      });
    });
    test('Should return status 409 when duplicate email attempted', function () {
      return (0, _accountMock.createAccountMockProm)().then(function (mockObject) {
        return _superagent2.default.post(apiUrl + '/signup').send({
          username: _faker2.default.internet.userName(),
          email: mockObject.account.email,
          password: _faker2.default.lorem.word()
        });
      }).then(Promise.reject).catch(function (res) {
        expect(res.status).toEqual(409);
      });
    });
    test('Should return status 500 when no information sent', function () {
      return _superagent2.default.post(apiUrl + '/signup').send({}).then(Promise.reject).catch(function (res) {
        expect(res.status).toEqual(500);
      });
    });
  });

  describe('GET /login', function () {
    test('Should return status 200 and TOKEN on successful get', function () {
      return (0, _accountMock.createAccountMockProm)().then(function (mockObject) {
        return _superagent2.default.get(apiUrl + '/login').auth(mockObject.request.username, mockObject.request.password);
      }).then(function (res) {
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeTruthy();
      });
    });
    test('Should return status 400 when no password sent', function () {
      return (0, _accountMock.createAccountMockProm)().then(function (mockObject) {
        return _superagent2.default.get(apiUrl + '/login').auth(mockObject.request.username, '');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
    test('Should return status 400 when no authorization sent', function () {
      return (0, _accountMock.createAccountMockProm)().then(function () {
        return _superagent2.default.get(apiUrl + '/login');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
  });
});