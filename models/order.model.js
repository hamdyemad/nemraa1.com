const mongoose = require('mongoose');
const defaultStatusColor = '#ccd53d';
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
    statuses: Array,
    orderPrice: Number,
    shipping: Number,
    orderShippingPrice: Number,
    products: [
        {
            productId: String,
            productSeq: Number,
            name: String,
            image: String,
            category: String,
            productInfo: [],
            unitPrice: Number,
            totalPrice: Number,
            totalAmount: Number,
        }
    ],
    statusInfo: {
        status: {
            type: String,
            default: 'معلق'
        },
        color: {
            type: String,
            default: defaultStatusColor
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