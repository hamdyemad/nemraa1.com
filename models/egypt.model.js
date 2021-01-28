const mongoose = require('mongoose');
const egyptSchema = mongoose.Schema({
  city: String,
  price: Number,
  freeShipping: {
    type: Boolean,
    default: false
  },
  addedDate: {
    default: new Date(),
    type: Date
  }
})

const egyptModel = mongoose.model('egypt', egyptSchema);

module.exports = egyptModel;