const mongoose = require('mongoose');
const informationSchema = mongoose.Schema({
    socials: {
        facebook: String,
        instagram: String,
        telegram: String,
        watsappNumber: String
    },
    location: {
        address: String,
        city: String,
        country: String
    },
    logo: String,
    email: String,
    companyName: String,
    aboutCompany: String,
    qrCode: String
});

const Information = mongoose.model('information', informationSchema);

module.exports = Information;