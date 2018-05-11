'use strict';

import faker from 'faker';
import * as awsSDKMock from 'aws-sdk-mock';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.ACL || !params.Body) {
    return callback(new Error('SETUP AND MOCK UPLOAD ERROR: key, bucket, body, and ACL required'));
  }
  if (params.ACL !== 'public-read') {
    return callback(new Error('SETUP AND MOCK UPLOAD ERROR: ACL must be public-read'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AND MOCK UPLOAD ERROR: wrong bucket'));
  }
  return callback(null, { Location: faker.internet.url() });
});

awsSDKMock.mock('S3', 'getObject', (params, callback) => {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('SETUP AND MOCK GET ERROR: key and bucket required'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AND MOCK UPLOAD ERROR: wrong bucket'));
  }
  return callback(null, { content: 'GOT OBJECT??' });
});

awsSDKMock.mock('S3', 'deleteObject', (params, callback) => {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('SETUP AND MOCK DELETE ERROR: key and bucket required'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AND MOCK DELETE ERROR: wrong bucket'));
  }
  return callback(null, {});
});
