'use strict';

import HttpErrors from 'http-errors';
import jwt from 'jsonwebtoken';
import Account from '../model/account';

const promisify = callback => (...args) => {
  return new Promise((resolve, reject) => {
    callback(...args, (error, data) => {
      if (error) return reject(error);
      return resolve(data);
    });
  });
};

export default (req, res, next) => {
  if (!req.headers.authorization) return next(new HttpErrors(400, 'BEAR AUTH: Invalid Request - 1'));

  const token = req.headers.authorization.split(' ')[1];
  if (!token) return next(new HttpErrors(400, 'BEAR AUTH: Invalid Request - 2'));

  return promisify(jwt.verify)(token, process.env.SECRET)
    .then((decryptedData) => {
      return Account.findOne({ tokenSeed: decryptedData.tokenSeed });
    })
    .then((account) => {
      if (!account) return next(new HttpErrors(400, 'BEAR AUTH: Invalid Request - 3'));
      req.account = account;
      return next();
    })
    .catch(next);
};
