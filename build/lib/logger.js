'use strict';

// winston is too finicky to be imported directly, needs to be required (ES5)

Object.defineProperty(exports, "__esModule", {
  value: true
});
var winston = require('winston');

var logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: new Date().toDateString().replace(/ /g, '-') + '.log', level: 'verbose' }), new winston.transports.Console({ format: winston.format.simple(), level: 'info' })]
});

logger.INFO = 'info';
logger.ERROR = 'error';
logger.VERBOSE = 'verbose';

exports.default = logger;