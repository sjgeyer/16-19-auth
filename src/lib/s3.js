'use strict';

import fs from 'fs-extra';
import logger from './logger';

const s3upload = (path, key) => {
  const aws = require('aws-sdk');
  const amazons3 = new aws.S3();

  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  };
  return amazons3.upload(uploadOptions)
    .promise()
    .then((response) => {
      return fs.remove(path)
        .then(() => response.Location)
        .catch(err => Promise.reject(err));
    })
    .catch((err) => {
      return fs.remove(path)
        .then(() => Promise.reject(err))
        .catch(fsErr => Promise.reject(fsErr));
    });
};

const s3retrieve = (key) => {
  const aws = require('aws-sdk');
  const amazons3 = new aws.S3();
  const retrieveOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return amazons3.getObject(retrieveOptions)
    .promise()
    .then(image => image)
    .catch((err) => {
      logger.log(logger.ERROR, `${err} in s3retrieve test`);
      Promise.reject(err);
    });
};

const s3remove = (key) => {
  const aws = require('aws-sdk');
  const amazons3 = new aws.S3();
  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return amazons3.deleteObject(removeOptions).promise()
    .then(data => console.log(data, 'SUCCESSFUL DELETE'))
    .catch(err => Promise.reject(err));
};

export { s3upload, s3remove, s3retrieve };
