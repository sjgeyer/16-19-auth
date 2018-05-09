'use strict';

import HttpErrors from 'http-errors';
import Account from '../model/account';

export default (req, res, next) => {
  if (!req.headers.authorization) return next(new HttpErrors(400, 'Invalid Request'));
  const base64AuthHeader = req.headers.authorization.split(' ')[1];
  if (!base64AuthHeader) return next(new HttpErrors(400, 'Invalid Request'));
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  const [username, password] = stringAuthHeader.split(':');
  if (!username || !password) return next(new HttpErrors(400, 'Invalid Request'));
  return Account.findOne({ username })
    .then((account) => {
      if (!account) return next(new HttpErrors(400, 'Invalid Request'));
      return account.verifyPasswordProm(password)
        .then((verifiedAccount) => {
          req.account = verifiedAccount;
          return next();
        })
        .catch(next);
    });
};
