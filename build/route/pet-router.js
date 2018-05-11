'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _bodyParser = require('body-parser');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _pet = require('../model/pet');

var _pet2 = _interopRequireDefault(_pet);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = (0, _bodyParser.json)();
var petRouter = new _express.Router();

petRouter.post('/pets', _bearerAuthMiddleware2.default, jsonParser, function (req, res, next) {
  if (!req.account) return next(new _httpErrors2.default(400, 'Invalid request'));
  return new _pet2.default(_extends({}, req.body, {
    account: req.account._id
  })).save().then(function (pet) {
    _logger2.default.log(_logger2.default.INFO, 'Returning 200 and new pet');
    return res.json(pet);
  }).catch(next);
});

petRouter.get('/pets/:id', _bearerAuthMiddleware2.default, function (req, res, next) {
  if (!req.account) return next(new _httpErrors2.default(400, 'Missing account'));
  return _pet2.default.findById(req.params.id).then(function (pet) {
    _logger2.default.log(_logger2.default.INFO, 'Returning 200 and pet');
    return res.json(pet);
  }).catch(next);
});

exports.default = petRouter;