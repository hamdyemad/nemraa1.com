const mongoose = require("mongoose");
const orderStatus = require("./order-status");
const orderSchema = mongoose.Schema({
  seq: Number,
  static: String,
  cities: Array,
  statuses: [],
  orderPrice: Number,
  shipping: Number,
  orderFinallyPrice: Number,
  orderDiscount: Number,
  orderMaker: String,
  adminVerfied: [],
  products: [
    {
      _id: String,
      seq: Number,
      name: String,
      image: String,
      category: String,
      category_id: String,
      isBreakable: Boolean,
      facebookPexel: String,
      productInfo: [],
      unitPrice: Number,
      totalPrice: Number,
      totalAmount: Number,
    },
  ],
  statusInfo: {
    status: {
      type: String,
      default: orderStatus.status,
    },
    color: {
      type: String,
      default: orderStatus.statusColor,
    },
    productStatus: {
      type: String,
      default: orderStatus.productStatus,
    },
  },
  orderIncome: {
    type: String,
    default: "website",
  },
  // client info
  clientInfo: {
    clientName: String,
    address: String,
    mobile: String,
    city: String,
    notes: String,
  },
  // client info
  statusHistory: {
    type: Array,
    default: [],
  },
  updatedDate: Date,
  addedDate: {
    type: String,
  },
});
const Order = mongoose.model("order", orderSchema);

module.exports = Order;
