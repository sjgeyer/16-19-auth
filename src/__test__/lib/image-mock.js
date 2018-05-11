'use strict';

import faker from 'faker';
import { createAccountMockProm } from './account-mock';
import Image from '../../model/image';
import Account from '../../model/account';

const createImageMockProm = () => {
  const resultMock = {};
  return createAccountMockProm()
    .then((mockAccountResponse) => {
      resultMock.accountMock = mockAccountResponse;
      return new Image({
        name: faker.lorem.word(),
        url: faker.random.image(),
        key: faker.random.number(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((image) => {
      resultMock.image = image;
      return resultMock;
    });
};

const removeImageMockProm = () => {
  Promise.all([
    Image.remove({}),
    Account.remove({}),
  ]);
};

export { createImageMockProm, removeImageMockProm };
