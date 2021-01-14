const mongoose = require('mongoose');
let doDate = (number) => {
    return (+number < 10) ? number = `${0}${number}` : number;
}
let date = new Date();
let month = `${date.getMonth() + 1}`;
let day = `${date.getDate()}`;
month = doDate(month);
day = doDate(day);
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
        type: String,
        default: `${date.getFullYear()}-${month}-${day}`
    }
})

const Auth = mongoose.model('auth', authSchema);

module.exports = Auth;