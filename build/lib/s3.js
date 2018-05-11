'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3retrieve = exports.s3remove = exports.s3upload = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var s3upload = function s3upload(path, key) {
  var aws = require('aws-sdk');
  var amazons3 = new aws.S3();

  var uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: _fsExtra2.default.createReadStream(path)
  };
  return amazons3.upload(uploadOptions).promise().then(function (response) {
    return _fsExtra2.default.remove(path).then(function () {
      return response.Location;
    }).catch(function (err) {
      return Promise.reject(err);
    });
  }).catch(function (err) {
    return _fsExtra2.default.remove(path).then(function () {
      return Promise.reject(err);
    }).catch(function (fsErr) {
      return Promise.reject(fsErr);
    });
  });
};

var s3retrieve = function s3retrieve(key) {
  var aws = require('aws-sdk');
  var amazons3 = new aws.S3();
  var retrieveOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET
  };
  return amazons3.getObject(retrieveOptions).promise().then(function (image) {
    return image;
  }).catch(function (err) {
    _logger2.default.log(_logger2.default.ERROR, err + ' in s3retrieve test');
    Promise.reject(err);
  });
};

var s3remove = function s3remove(key) {
  var aws = require('aws-sdk');
  var amazons3 = new aws.S3();
  var removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET
  };
  return amazons3.deleteObject(removeOptions).promise().then(function (data) {
    return console.log(data, 'SUCCESSFUL DELETE');
  }).catch(function (err) {
    return Promise.reject(err);
  });
};

exports.s3upload = s3upload;
exports.s3remove = s3remove;
exports.s3retrieve = s3retrieve;