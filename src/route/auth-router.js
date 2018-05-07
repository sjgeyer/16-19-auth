'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import Account from '../model/account';
import logger from '../lib/logger';

const authRouter = new Router();
const jsonParser = json();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  return Account.create(req.body.username, req.body.email, req.body.password)
    .then((account) => {
      delete req.body.password;
      logger.log(logger.INFO, 'AUTH - creating TOKEN');
      return account.createTokenProm();
    })
    .then((token) => {
      logger.log(logger.INFO, 'AUTH - returning 200 and token');
      return res.json({ token });
    })
    .catch(next);
});

export default authRouter;
