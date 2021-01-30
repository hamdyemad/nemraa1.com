const mongoose = require('mongoose');

const advertisingSchema = mongoose.Schema({
    link: String,
    image: String,
    role: String
});

const advertisingModel = mongoose.model('advertising', advertisingSchema);

module.exports = advertisingModel;