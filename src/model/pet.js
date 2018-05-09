'use strict';

import mongoose from 'mongoose';

const petSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  dateAdopted: {
    type: Date,
    default: () => new Date(),
  },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

export default mongoose.model('pet', petSchema);
