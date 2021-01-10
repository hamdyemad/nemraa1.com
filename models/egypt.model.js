const mongoose = require('mongoose');
const egyptSchema = mongoose.Schema({
  city: String,
  price: Number,
  addedDate: {
    default: new Date(),
    type: Date
  }
})

const egyptModel = mongoose.model('egypt', egyptSchema);

module.exports = egyptModel;