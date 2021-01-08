const mongoose = require('mongoose');
const egyptSchema = mongoose.Schema({
    city: String
})

const egyptModel = mongoose.model('egypt', egyptSchema);

module.exports = egyptModel;