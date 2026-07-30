const mongoose = require('mongoose');

const placeholderSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Placeholder', placeholderSchema);
