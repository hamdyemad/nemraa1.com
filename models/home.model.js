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
            }
        }
    ]
});

const homeModel = mongoose.model('home', homeSchema);
module.exports = homeModel;