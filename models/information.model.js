const mongoose = require('mongoose');
const informationSchema = mongoose.Schema({
    socials: {
        facebook: String,
        instagram: String,
        youtube: String,
        watsappNumber: String
    },
    location: {
        city: String,
        country: String
    },
    logo: String,
    email: String,
    mobile: String,
    companyName: String,
    aboutCompany: String,
    qrCode: String
});

const Information = mongoose.model('information', informationSchema);

module.exports = Information;