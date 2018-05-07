'use strict';

import faker from 'faker';
import Account from '../../model/account';

const createAccountMockProm = () => {
  const mock = {};
  mock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.word(),
  };
  return Account.create(mock.request.username, mock.request.email, mock.request.password)
    .then((account) => {
      mock.account = account;
      return account.createTokenProm();
    })
    .then((token) => {
      mock.token = token;
      return Account.findById(mock.account._id);
    })
    .then((account) => {
      mock.account = account;
      return mock;
    });
};

const removeAccountMockProm = () => Account.remove({});

export { createAccountMockProm, removeAccountMockProm };
