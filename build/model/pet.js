'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var petSchema = _mongoose2.default.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  dateAdopted: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  },
  account: {
    type: _mongoose2.default.Schema.ObjectId,
    required: true
  }
});

exports.default = _mongoose2.default.model('pet', petSchema);