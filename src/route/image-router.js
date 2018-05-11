'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import Image from '../model/image';
import { s3upload, s3remove, s3retrieve } from '../lib/s3';
import logger from '../lib/logger';

const multerUpload = multer({ dest: `${__dirname}/../temp` });
const imageRouter = new Router();

imageRouter.post('/images', bearerAuthMiddleware, multerUpload.any(), (req, res, next) => {
  if (!req.account) return next(new HttpError(400, 'IMAGE ROUTER - NOT FOUND'));
  if (!req.body.name || req.files.length > 1 || req.files[0].fieldname !== 'image') {
    return next(new HttpError(400, 'IMAGE ROUTER - INVALID REQUEST'));
  }
  const [file] = req.files;
  const key = `${file.filename}.${file.originalname}`;
  return s3upload(file.path, key)
    .then((url) => {
      return new Image({
        name: req.body.name,
        url,
        key,
        account: req.account._id,
      }).save();
    })
    .then(image => res.json(image))
    .catch(next);
});

imageRouter.get('/images/:id/metadata', bearerAuthMiddleware, (req, res, next) => {
  if (!req.params.id) return next(new HttpError(400, 'IMAGE ROUTER - NO ID PASSED'));
  return Image.findById(req.params.id)
    .then((image) => {
      return s3retrieve(image.key)
        .then(data => res.json(data))
        .catch(err => logger.log(logger.INFO, `${err}, error from ROUTER GET`));
    })
    .catch(next);
});

imageRouter.get('/images/:id', bearerAuthMiddleware, (req, res, next) => {
  if (!req.params.id) return next(new HttpError(400, 'IMAGE ROUTER - NO ID PASSED'));
  return Image.findById(req.params.id)
    .then(image => res.json(image))
    .catch(next);
});

imageRouter.delete('/images/:id', bearerAuthMiddleware, (req, res, next) => {
  if (!req.params.id) return next(new HttpError(400, 'IMAGE ROUTER DELETE: NO ID PASSED'));
  return Image.findById(req.params.id)
    .then((image) => {
      return s3remove(image.key)
        .then(() => res.sendStatus(204));
    })
    .catch(next);
});

export default imageRouter;
