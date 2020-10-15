const mongoose = require('mongoose');
const date = new Date();
const authSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    addedDate: {
        type: Date,
        default: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
    }
})

const Auth = mongoose.model('auth', authSchema);

module.exports = Auth;