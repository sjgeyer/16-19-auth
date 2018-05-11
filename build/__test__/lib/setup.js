'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _awsSdkMock = require('aws-sdk-mock');

var awsSDKMock = _interopRequireWildcard(_awsSdkMock);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

awsSDKMock.mock('S3', 'upload', function (params, callback) {
  if (!params.Key || !params.Bucket || !params.ACL || !params.Body) {
    return callback(new Error('SETUP AND MOCK UPLOAD ERROR: key, bucket, body, and ACL required'));
  }
  if (params.ACL !== 'public-read') {
    return callback(new Error('SETUP AND MOCK UPLOAD ERROR: ACL must be public-read'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AND MOCK UPLOAD ERROR: wrong bucket'));
  }
  return callback(null, { Location: _faker2.default.internet.url() });
});

awsSDKMock.mock('S3', 'getObject', function (params, callback) {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('SETUP AND MOCK GET ERROR: key and bucket required'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AND MOCK UPLOAD ERROR: wrong bucket'));
  }
  return callback(null, { content: 'GOT OBJECT??' });
});

awsSDKMock.mock('S3', 'deleteObject', function (params, callback) {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('SETUP AND MOCK DELETE ERROR: key and bucket required'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AND MOCK DELETE ERROR: wrong bucket'));
  }
  return callback(null, {});
});