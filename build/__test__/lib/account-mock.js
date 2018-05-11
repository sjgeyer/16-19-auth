'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAccountMockProm = exports.createAccountMockProm = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAccountMockProm = function createAccountMockProm() {
  var mock = {};
  mock.request = {
    username: _faker2.default.internet.userName(),
    email: _faker2.default.internet.email(),
    password: _faker2.default.lorem.word()
  };
  return _account2.default.create(mock.request.username, mock.request.email, mock.request.password).then(function (account) {
    mock.account = account;
    return account.createTokenProm();
  }).then(function (token) {
    mock.token = token;
    return _account2.default.findById(mock.account._id);
  }).then(function (account) {
    mock.account = account;
    return mock;
  });
};

var removeAccountMockProm = function removeAccountMockProm() {
  return _account2.default.remove({});
};

exports.createAccountMockProm = createAccountMockProm;
exports.removeAccountMockProm = removeAccountMockProm;