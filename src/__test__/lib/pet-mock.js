'use strict';

import faker from 'faker';
import Pet from '../../model/pet';
import { createAccountMockProm, removeAccountMockProm } from './account-mock';

const createPetMockProm = () => {
  const resultMock = {};
  return createAccountMockProm()
    .then((mockObject) => {
      resultMock.accountObject = mockObject;
      return new Pet({
        name: faker.name.firstName(),
        type: faker.lorem.word(),
        account: mockObject.account._id,
      }).save();
    })
    .then((pet) => {
      resultMock.pet = pet;
      return resultMock;
    });
};

const removePetMockProm = () => {
  return Promise.all([
    Pet.remove({}),
    removeAccountMockProm(),
  ]);
};

export { createPetMockProm, removePetMockProm };
