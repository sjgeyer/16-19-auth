'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePetMockProm = exports.createPetMockProm = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _pet = require('../../model/pet');

var _pet2 = _interopRequireDefault(_pet);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createPetMockProm = function createPetMockProm() {
  var resultMock = {};
  return (0, _accountMock.createAccountMockProm)().then(function (mockObject) {
    resultMock.accountObject = mockObject;
    return new _pet2.default({
      name: _faker2.default.name.firstName(),
      type: _faker2.default.lorem.word(),
      account: mockObject.account._id
    }).save();
  }).then(function (pet) {
    resultMock.pet = pet;
    return resultMock;
  });
};

var removePetMockProm = function removePetMockProm() {
  return Promise.all([_pet2.default.remove({}), (0, _accountMock.removeAccountMockProm)()]);
};

exports.createPetMockProm = createPetMockProm;
exports.removePetMockProm = removePetMockProm;