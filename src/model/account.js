'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import HttpErrors from 'http-errors';
import jsonWebToken from 'jsonwebtoken';

const HASH_ROUNDS = 8;
const TOKEN_SEED_LENGTH = 128;

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});

function createTokenProm() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      return jsonWebToken.sign({ tokenSeed: account.tokenSeed }, process.env.SECRET);
    });
}

function verifyPasswordProm(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) throw new HttpErrors(400, 'Invalid request');
      return this;
    });
}

accountSchema.methods.createTokenProm = createTokenProm;
accountSchema.methods.verifyPasswordProm = verifyPasswordProm;

const Account = mongoose.model('account', accountSchema);

Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; // eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
};

export default Account;
