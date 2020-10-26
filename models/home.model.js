const mongoose = require('mongoose');
const homeSchema = mongoose.Schema({
    carouselImgs: Array,
    static: String
});

const homeModel = mongoose.model('home', homeSchema);
module.exports = homeModel;