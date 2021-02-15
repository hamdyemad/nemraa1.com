const mongoose = require('mongoose');
const advertiseSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    advertisingsOfCategory: [
        {
            advertiseImage: {
                type: String,
                required: true
            },
            advertiseLink: {
                type: String,
                required: true
            }
        }
    ]
});
const Advertise = mongoose.model('advertise', advertiseSchema);

module.exports = Advertise;