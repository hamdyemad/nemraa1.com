const mongoose = require('mongoose');
const orderStatus = require('./order-status');
let doDate = (number) => {
    return (+number < 10) ? number = `${0}${number}` : number;
}
let date = new Date();
let month = `${date.getMonth() + 1}`;
let day = `${date.getDate()}`;
month = doDate(month);
day = doDate(day);
const orderSchema = mongoose.Schema({
    seq: Number,
    static: String,
    cities: Array,
    statuses: [],
    orderPrice: Number,
    shipping: Number,
    orderShippingPrice: Number,
    products: [
        {
            _id: String,
            seq: Number,
            name: String,
            image: String,
            category: String,
            facebookPexel: String,
            productInfo: [],
            unitPrice: Number,
            totalPrice: Number,
            totalAmount: Number
        }
    ],
    statusInfo: {
        status: {
            type: String,
            default: orderStatus.status
        },
        color: {
            type: String,
            default: orderStatus.statusColor
        },
        productStatus: {
            type: String,
            default: orderStatus.productStatus
        }
    },
    // client info
    clientInfo: {
        clientName: String,
        address: String,
        mobile: String,
        city: String,
        notes: String
    },
    // client info
    statusHistory: {
        type: Array,
        default: []
    },
    updatedDate: Date,
    addedDate: {
        type: String,
        default: `${date.getFullYear()}-${month}-${day}`
    }
});
const Order = mongoose.model('order', orderSchema);

module.exports = Order;