const mongoose = require('mongoose');
const informationSchema = mongoose.Schema({
    socials: {
        facebook: String,
        instagram: String,
        youtube: String,
        watsappNumber: String
    },
    logo: String,
    email: String,
    mobile: String,
    companyName: String,
    qrCode: String
});

const Information = mongoose.model('information', informationSchema);

module.exports = Information;