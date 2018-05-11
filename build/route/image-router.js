'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _image = require('../model/image');

var _image2 = _interopRequireDefault(_image);

var _s2 = require('../lib/s3');

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });
var imageRouter = new _express.Router();

imageRouter.post('/images', _bearerAuthMiddleware2.default, multerUpload.any(), function (req, res, next) {
  if (!req.account) return next(new _httpErrors2.default(400, 'IMAGE ROUTER - NOT FOUND'));
  if (!req.body.name || req.files.length > 1 || req.files[0].fieldname !== 'image') {
    return next(new _httpErrors2.default(400, 'IMAGE ROUTER - INVALID REQUEST'));
  }

  var _req$files = _slicedToArray(req.files, 1),
      file = _req$files[0];

  var key = file.filename + '.' + file.originalname;
  return (0, _s2.s3upload)(file.path, key).then(function (url) {
    return new _image2.default({
      name: req.body.name,
      url: url,
      key: key,
      account: req.account._id
    }).save();
  }).then(function (image) {
    return res.json(image);
  }).catch(next);
});

imageRouter.get('/images/:id/metadata', _bearerAuthMiddleware2.default, function (req, res, next) {
  if (!req.params.id) return next(new _httpErrors2.default(400, 'IMAGE ROUTER - NO ID PASSED'));
  return _image2.default.findById(req.params.id).then(function (image) {
    return (0, _s2.s3retrieve)(image.key).then(function (data) {
      return res.json(data);
    }).catch(function (err) {
      return _logger2.default.log(_logger2.default.INFO, err + ', error from ROUTER GET');
    });
  }).catch(next);
});

imageRouter.get('/images/:id', _bearerAuthMiddleware2.default, function (req, res, next) {
  if (!req.params.id) return next(new _httpErrors2.default(400, 'IMAGE ROUTER - NO ID PASSED'));
  return _image2.default.findById(req.params.id).then(function (image) {
    return res.json(image);
  }).catch(next);
});

imageRouter.delete('/images/:id', _bearerAuthMiddleware2.default, function (req, res, next) {
  if (!req.params.id) return next(new _httpErrors2.default(400, 'IMAGE ROUTER DELETE: NO ID PASSED'));
  return _image2.default.findById(req.params.id).then(function (image) {
    return (0, _s2.s3remove)(image.key).then(function () {
      return res.sendStatus(204);
    });
  }).catch(next);
});

exports.default = imageRouter;