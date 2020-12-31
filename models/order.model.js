const mongoose = require('mongoose');
const date = new Date();
const orderSchema = mongoose.Schema({
    seq: Number,
    static: String,
    cities: Array,
    statuses: Array,
    order: {
        productId: String,
        productSeq: Number,
        category: String,
        choosedColor: String,
        choosedSize: String,
        name: String,
        image: String,
        price: Number,
        unitPrice: Number,
        discount: Number,
        totalPrice: Number,
        amount: Number,
        orderDiscount: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        default: 'معلق'
    },
    // client info
    clientInfo: {
        name: String,
        address: String,
        mobile: String,
        city: String,
        comment: String
    },
    // client info
    statusHistory: {
        type: Array,
        default: []
    },
    updatedDate: Date,
    addedDate: {
        type: String,
        default: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    adminVerfied: []
});
const Order = mongoose.model('order', orderSchema);

module.exports = Order;