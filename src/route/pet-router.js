'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Pet from '../model/pet';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const jsonParser = json();
const petRouter = new Router();

petRouter.post('/pets', bearerAuthMiddleware, jsonParser, (req, res, next) => {
  if (!req.account) return next(new HttpErrors(400, 'Invalid request'));
  return new Pet({
    ...req.body,
    account: req.account._id,
  })
    .save()
    .then((pet) => {
      logger.log(logger.INFO, 'Returning 200 and new pet');
      return res.json(pet);
    })
    .catch(next);
});

petRouter.get('/pets/:id', bearerAuthMiddleware, (req, res, next) => {
  if (!req.account) return next(new HttpErrors(400, 'Missing account'));
  return Pet.findById(req.params.id)
    .then((pet) => {
      logger.log(logger.INFO, 'Returning 200 and pet');
      return res.json(pet);
    })
    .catch(next);
});

export default petRouter;
