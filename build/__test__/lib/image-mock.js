'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeImageMockProm = exports.createImageMockProm = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _accountMock = require('./account-mock');

var _image = require('../../model/image');

var _image2 = _interopRequireDefault(_image);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createImageMockProm = function createImageMockProm() {
  var resultMock = {};
  return (0, _accountMock.createAccountMockProm)().then(function (mockAccountResponse) {
    resultMock.accountMock = mockAccountResponse;
    return new _image2.default({
      name: _faker2.default.lorem.word(),
      url: _faker2.default.random.image(),
      key: _faker2.default.random.number(),
      account: resultMock.accountMock.account._id
    }).save();
  }).then(function (image) {
    resultMock.image = image;
    return resultMock;
  });
};

var removeImageMockProm = function removeImageMockProm() {
  Promise.all([_image2.default.remove({}), _account2.default.remove({})]);
};

exports.createImageMockProm = createImageMockProm;
exports.removeImageMockProm = removeImageMockProm;