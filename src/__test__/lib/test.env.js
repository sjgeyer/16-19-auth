process.env.NODE_ENV = 'development';
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.SECRET = '578Ur6hvpAcO2Tm1SK71T4yJoYmlZY8gqLi1BW0txyLtWOqaJ7Li7Qa4lh1O4lGqKPOmvX6XLfJWzJTs1jnYTHNjcye0q5qI4pxF';

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakekfaekdlfjsklafjdkfdlfjdklafsdkdfldafldsmfioem';
  process.env.AWS_ACCESS_KEY_ID = 'fakeaccesskeyintestenv';
  require('./setup');
} else {
  require('dotenv').config();
}
