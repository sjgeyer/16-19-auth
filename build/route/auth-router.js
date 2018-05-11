'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bodyParser = require('body-parser');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _basicAuthMiddleware = require('../lib/basic-auth-middleware');

var _basicAuthMiddleware2 = _interopRequireDefault(_basicAuthMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authRouter = new _express.Router();
var jsonParser = (0, _bodyParser.json)();

authRouter.post('/signup', jsonParser, function (req, res, next) {
  return _account2.default.create(req.body.username, req.body.email, req.body.password).then(function (account) {
    delete req.body.password;
    _logger2.default.log(_logger2.default.INFO, 'AUTH - creating TOKEN');
    return account.createTokenProm();
  }).then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH - returning 200 and token');
    return res.json({ token: token });
  }).catch(next);
});

authRouter.get('/login', _basicAuthMiddleware2.default, function (req, res, next) {
  if (!req.account) return next(new _httpErrors2.default(400, 'AUTH ROUTER - Bad request'));
  return req.account.createTokenProm().then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH ROUTER - returning 200 and token');
    return res.json({ token: token });
  }).catch(next);
});

exports.default = authRouter;