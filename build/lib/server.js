'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _errorMiddleware = require('./error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

var _authRouter = require('../route/auth-router');

var _authRouter2 = _interopRequireDefault(_authRouter);

var _petRouter = require('../route/pet-router');

var _petRouter2 = _interopRequireDefault(_petRouter);

var _imageRouter = require('../route/image-router');

var _imageRouter2 = _interopRequireDefault(_imageRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = null;

app.use(_authRouter2.default);
app.use(_petRouter2.default);
app.use(_imageRouter2.default);
app.all('*', function (req, res) {
  _logger2.default.log(_logger2.default.INFO, 'Returning 404 from * route');
  return res.sendStatus(404);
});
app.use(_errorMiddleware2.default);

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    server = app.listen(process.env.PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'Server listening on port ' + process.env.PORT);
    });
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is off');
    });
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;