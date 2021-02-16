const mongoose = require('mongoose');
const homeSchema = mongoose.Schema({
    homeCarousel: [
        {
            carouselImage: {
                type: String,
                required: true,
            },
            carouselHeader: {
                type: String,
                required: true
            },
            carouselButton: {
                type: String
            },
            show: {
                type: Boolean,
                default: false,
                required: true
            }
        }
    ]
});

const homeModel = mongoose.model('home', homeSchema);
module.exports = homeModel;