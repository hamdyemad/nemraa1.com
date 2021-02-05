const Order = require('../models/order.model');
const Product = require('../models/products.model');
const Auth = require('../models/auth.model');

/* POST Add new order but before we add the order we increament the sequence value and pass the end value to the newest order */
exports.addOrder = (req, res) => {
  const io = req.app.get('io');
  Order.findOneAndUpdate({ static: 'static' }, { $inc: { seq: 1 } }).then((value) => {
    let seq = value.seq;
    const body = req.body;
    const products = body.products;

    body['seq'] = seq;
    if (!body.orderDiscount) {
      body['orderDiscount'] = 0;
    }
    body['orderDiscount'] = body.orderDiscount;
    body['orderPrice'] = products.map((product) => {
      return product.totalPrice
    }).reduce((acc, current) => acc + current);
    body['orderFinallyPrice'] = (body['orderPrice'] + body.shipping) - body.orderDiscount;
    let newOrder = new Order(body);
    newOrder
      .save()
      .then((doc) => {
        Order.findOneAndUpdate({ static: 'static' }, { $addToSet: { cities: doc.clientInfo.city } }).then(() => {
          io.emit('orders');
          res.json({ message: `${doc.clientInfo.clientName} تم انهاء طلبك يا ` });
        });
      })
  })
};

/* PATCH update order by id */
exports.updateOrderById = (req, res) => {
  const body = req.body;
  const io = req.app.get('io');
  body['orderDiscount'] = body.orderDiscount;
  body['orderPrice'] = body.products.map((product) => {
    return product.totalPrice
  }).reduce((acc, current) => acc + current);
  Order.findById(req.params.id).then((doc) => {
    Order.updateOne({ _id: doc._id }, {
      'clientInfo.clientName': body.clientInfo.clientName,
      'clientInfo.mobile': body.clientInfo.mobile,
      'clientInfo.city': body.clientInfo.city,
      'clientInfo.address': body.clientInfo.address,
      'clientInfo.notes': body.clientInfo.notes,
      orderPrice: body['orderPrice'],
      orderDiscount: body.orderDiscount,
      orderFinallyPrice: (body['orderPrice'] + body.shipping) - body.orderDiscount,
      shipping: body.shipping,
      products: body.products,
      orderIncome: body.orderIncome
    }).then((val) => {
      io.emit('orders');
      res.json({ message: `بنجاح ${body.clientInfo.clientName} تم تعديل` });
    })
  })
};


/* GET get orders all and query */
exports.getOrders = (req, res) => {
  let query = req.query;
  if (Object.keys(query).length !== 0) {
    let findObj = { $nor: [{ static: 'static' }] };
    findObj.$and = [];
    Object.keys(query).forEach((q) => {
      let queryValue = query[q];
      if (q == 'clientName' || q == 'mobile' || q == 'city') {
        findObj.$and.push({ [`clientInfo.${[q]}`]: new RegExp(`^${queryValue}`) });
      } else {
        if (q == 'status') {
          findObj.$and.push({ [`statusInfo.${[q]}`]: queryValue });
        } else {
          findObj.$and.push({ [`${[q]}`]: queryValue });
        }
      }
    });
    if (req.role == 'super-admin' || req.role == 'admin') {
      Order.find(findObj).sort({ seq: -1 })
        .then((value) => {
          res.json(value);
        })
    } else {
      findObj['adminVerfied.adminId'] = req.adminId
      Order.find(findObj).sort({ seq: -1 })
        .then((value) => {
          res.json(value);
        })
    }
  } else {
    if (req.role == 'super-admin' || req.role == 'admin') {
      Order.find({ $nor: [{ static: 'static' }] }).sort({ seq: -1 })
        .then((value) => {
          res.json(value);
        })
    } else {
      Order.find({ 'adminVerfied.adminId': req.adminId }).sort({ seq: -1 })
        .then((value) => {
          res.json(value);
        })
    }
  }
};

// get All completed orders by date
exports.getAllCompletedOrders = (req, res) => {
  let query = req.query;
  if (Object.keys(query).length !== 0) {
    let findObj = { $nor: [{ static: 'static' }] };
    findObj['statusInfo.status'] = 'تم التأكيد على العميل';
    findObj.$and = [];
    Object.keys(query).forEach((q) => {
      let queryValue = query[q];
      if (q == 'clientName' || q == 'mobile' || q == 'city') {
        findObj.$and.push({ [`clientInfo.${[q]}`]: new RegExp(`^${queryValue}`) });
      } else {
        findObj.$and.push({ [`${[q]}`]: queryValue });
      }
    });
    if (req.role == 'super-admin' || req.role == 'admin') {
      Order.find(findObj).sort({ seq: -1 })
        .then((value) => {
          res.json(value);
        })
    } else {
      findObj['adminVerfied.adminId'] = req.adminId
      Order.find(findObj).sort({ seq: -1 })
        .then((value) => {
          res.json(value);
        })
    }
  } else {
    if (req.role == 'super-admin' || req.role == 'admin') {
      Order.find({ 'statusInfo.status': 'تم التأكيد على العميل' }).sort({ updatedDate: -1 }).then((doc) => {
        res.json(doc);
      })

    } else {
      Order.find({ 'statusInfo.status': 'تم التأكيد على العميل', 'adminVerfied.adminId': req.adminId }).sort({ updatedDate: -1 }).then((doc) => {
        res.json(doc);
      })
    }
  }
}


/* GET get static*/
exports.getStatic = (req, res) => {
  Order.findOne({ static: 'static' }).then((doc) => {
    res.json(doc);
  })
}

/* POST add order with admin view by pass the adminId to adminVerfied  */
exports.addOrderShowWithAdmin = (req, res) => {
  const body = req.body;
  const io = req.app.get('io');
  Auth.findById(body.adminId).then(doc => {
    if (doc) {
      Order.findOneAndUpdate({ _id: body.orderId }, {
        $addToSet: {
          adminVerfied: { adminId: body.adminId, email: doc.email }
        }
      }).then(() => {
        io.emit('orders');
        res.json({ message: `الى الطلب ${doc.email} تم أضافة` });
      })
    }
  })
};

/* DELETE remove order with admin view by pass the adminId to adminVerfied  */
exports.removeOrderShowWithAdmin = (req, res) => {
  const body = req.body;
  const io = req.app.get('io');
  Order.findOneAndUpdate({ _id: body.orderId }, {
    $pull: {
      adminVerfied: { adminId: body.adminId }
    }
  }).then(() => {
    io.emit('orders');
    res.json()
  })
};

/* POST  update all statuese of static */
exports.updateStatus = (req, res) => {
  let io = req.app.get('io');
  Order.findOneAndUpdate({ static: 'static' }, { $addToSet: { statuses: req.body } }).then((doc) => {
    io.emit('staticOrders');
    res.json(doc);
  })
}

/* PATCH remove status bu status name */
exports.removeStatus = (req, res) => {
  let io = req.app.get('io');
  if (req.body.status !== 'معلق') {
    Order.findOneAndUpdate({ static: 'static' }, { $pull: { statuses: req.body } }).then((doc) => {
      io.emit('staticOrders');
      res.json({ message: `تم مسح ${req.body.status} بنجاح` });

    })
  } else {
    res.json({ message: 'خطأ' })
  }
}


/* GET get order by id */
exports.getOrderById = (req, res) => {
  Order.findById(req.params.id).then((doc) => {
    res.json(doc);
  })
}


/* DELETE delete order by id */
exports.deleteOrderById = (req, res) => {
  let io = req.app.get('io');

  Order.findByIdAndDelete(req.params.id).then((doc) => {
    io.emit('orders')
    res.json(doc);
  })
}

/* POST add status histroy */
exports.addStatusHistory = (req, res) => {
  const date = new Date();
  const body = req.body;
  const statusObj = body.statusObj;
  let io = req.app.get('io');
  let history = {};
  history.notes = body.notes
  history.updatedDate = date;
  // get static
  Order.findOne({ static: 'static' }).then((doc) => {
    history['statusInfo'] = doc.statuses.find((statObj) => {
      if (statObj.status == statusObj.status) {
        return statObj
      }
    });
    if (history.statusInfo.productStatus == '+') {
      for (let product of body.products) {
        Product.findById(product._id).then((productDoc) => {
          if (productDoc.amount !== 0) {
            Product.findByIdAndUpdate(productDoc._id, { $inc: { amount: product.totalAmount } }).then()
          }
        })
      }

    } else if (history.statusInfo.productStatus == '-') {
      for (let product of body.products) {
        Product.findById(product._id).then((productDoc) => {
          if (productDoc.amount !== 0) {
            Product.findByIdAndUpdate(productDoc._id, { $inc: { amount: -product.totalAmount } }).then()
          }
        })
      }
    }
    Order.updateOne({ _id: req.params.id },
      {
        $push: { statusHistory: history },
        'statusInfo.status': history.statusInfo.status,
        'statusInfo.color': history.statusInfo.color,
        'statusInfo.productStatus': history.statusInfo.productStatus,
        updatedDate: date,
        "clientInfo.notes": history.notes
      }).then(() => {
        io.emit('products');
        io.emit('orders');
        res.json({ message: `تم تعديل الحالة الى ${history.statusInfo.status}` });
      })
  })
}
/* POST add array of history */
exports.addManyOfHistory = (req, res) => {
  let date = new Date();
  const body = req.body;
  let io = req.app.get('io');
  let history = { statusInfo: body.statusInfo };
  history['updatedDate'] = date;
  for (let seq of body.seqs) {
    Order.findOne({ seq: seq.seq }).then((orderDoc) => {
      if (orderDoc) {
        if (history.statusInfo.productStatus == '+') {
          for (let product of orderDoc.products) {
            Product.findById(product._id).then((productDoc) => {
              if (productDoc.amount !== 0) {
                Product.findByIdAndUpdate(productDoc._id, { $inc: { amount: product.totalAmount } }).then()
              }
            })
          }
        }
        else if (history.statusInfo.productStatus == '-') {
          for (let product of orderDoc.products) {
            Product.findById(product._id).then((productDoc) => {
              if (productDoc.amount !== 0) {
                Product.findByIdAndUpdate(productDoc._id, { $inc: { amount: -product.totalAmount } }).then()
              }
            })
          }
        }
      }
    })
  }
  Order.updateMany({ $or: body.seqs, $nor: [{ static: 'static' }] },
    {
      $push: { statusHistory: history },
      'statusInfo.status': history.statusInfo.status,
      'statusInfo.color': history.statusInfo.color,
      'statusInfo.productStatus': history.statusInfo.productStatus,
      updatedDate: date,
    }).then((value) => {
      io.emit('products');
      io.emit('orders');
      res.json(value);
    })
}


/* GET get Invoices by passing the seqs of orders i checked it's about array of id's like: [{seq: 1}. {seq: 2}]; */
exports.getOrdersByPassTheSeqs = (req, res) => {
  let seqs = req.body;
  Order.find({ $nor: [{ static: 'static' }], seq: { $in: seqs } })
    .then((value) => {
      res.json(value);
    })
}