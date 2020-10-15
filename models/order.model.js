const mongoose = require('mongoose');
const date = new Date();
const orderSchema = mongoose.Schema({
    seq: Number,
    static: String,
    orders: Array,
    totalPrice: Number,
    status: {
        type: String,
        default: 'pending'
    },
    // client info
    clientInfo: {
        name: String,
        address: String,
        mobile: Number,
        city: String,
        comment: String
    },
    // client info
    notifiedCustomer: {
        type: Boolean,
        default: false
    },
    statusHistory: {
        type: Array,
        default: []
    },
    addedDate: {
        type: Date,
        default: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
    }
});
const Order = mongoose.model('order', orderSchema);

module.exports = Order;