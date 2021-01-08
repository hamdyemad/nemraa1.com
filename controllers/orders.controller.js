const Order = require('../models/order.model');
const authModel = require('../models/auth.model');
const Product = require('../models/products.model');
const { find } = require('../models/order.model');
/* POST Add new order but before we add the order we increament the sequence value and pass the end value to the newest order */
exports.addOrder = (req, res) => {
  Order.findOneAndUpdate({ static: 'static' }, { $inc: { seq: 1 } }).then((value) => {
    let seq = value.seq;
    const body = req.body;
    const products = body.products;

    for (let product of products) {
      Product.findById(product.productId).then((doc) => {
        Product.updateOne({ _id: doc._id }, { amount: doc.amount - product.totalAmount }).then()
      })
    }
    body['seq'] = seq;
    body['orderPrice'] = products.map((product) => {
      return product.totalPrice
    }).reduce((acc, current) => acc + current);
    let newOrder = new Order(body);
    newOrder
      .save()
      .then((doc) => {
        Order.findOneAndUpdate({ static: 'static' }, { $addToSet: { cities: doc.clientInfo.city } }).then(() => {
          res.json({ message: `تم اضافة طلب ${doc.clientInfo.clientName} بنجاح` });
        });
      })
  })
};

// get All completed orders by date
exports.getAllCompletedOrders = (req, res) => {
  Order.find({}).sort({ updatedDate: -1 }).then((doc) => {
    res.json(doc);
  })
}

/* GET get all orders  */
exports.getAllOrders = (req, res) => {
  let query = req.query;
  if (Object.keys(query).length !== 0) {
    let findObj = { $nor: [{ static: 'static' }] };
    findObj.$and = [];
    Object.keys(query).forEach((q) => {
      let quertValue = query[q];
      if (q == 'clientName' || q == 'mobile' || q == 'city') {
        findObj.$and.push({ [`clientInfo.${[q]}`]: new RegExp(`^${quertValue}`) });
      } else {
        findObj.$and.push({ [`${[q]}`]: quertValue });
      }
    })
    Order.find(findObj).sort({ seq: -1 })
      .then((doc) => {
        res.json(doc);
      })
  } else {
    Order.find({ $nor: [{ static: 'static' }] }).sort({ seq: -1 })
      .then((value) => {
        res.json(value);
      })
  }
};

/* POST add order with admin view by pass the adminId to adminVerfied  */
exports.addOrderShowWithAdmin = (req, res) => {
  authModel.findById(req.body.adminId).then(doc => {
    if (doc) {
      Order.findOneAndUpdate({ _id: req.body.orderId }, {
        $addToSet: {
          adminVerfied: { adminId: req.body.adminId, email: doc.email }
        }
      }).then(doc => {
        res.json(doc);
      })

    }
  })
};

/* DELETE remove order with admin view by pass the adminId to adminVerfied  */
exports.removeOrderShowWithAdmin = (req, res) => {
  Order.findOneAndUpdate({ _id: req.body.orderId }, {
    $pull: {
      adminVerfied: { adminId: req.body.adminId }
    }
  }).then(doc => {
    res.json(doc);
  })
};

/* GET get static*/
exports.getStatic = (req, res) => {
  Order.findOne({ static: 'static' }).then((doc) => {
    res.json(doc);
  })
}

/* PATCH  update all statuese of static */
exports.updateStatuses = (req, res) => {
  Order.findOneAndUpdate({ static: 'static' }, { $addToSet: { statuses: req.body.newStatus } }).then((doc) => {
    res.json(doc);
  })
}

/* GET get order by id */
exports.getOrderById = (req, res) => {
  Order.findById(req.params.id).then((doc) => {
    res.json(doc);
  })
}

/* PATCh update order by id */
exports.editOrder = (req, res) => {
  Order.findByIdAndUpdate(req.params.id, {
    'clientInfo.name': req.body.name,
    'clientInfo.mobile': req.body.mobile,
    'clientInfo.address': req.body.address,
    'order.choosedColor': req.body.color,
    'order.choosedSize': req.body.size,
    'order.unitPrice': req.body.unitPrice,
    'order.amount': req.body.amount,
    'order.orderDiscount': req.body.orderDiscount,
    'order.totalPrice': (req.body.amount * req.body.unitPrice) - req.body.orderDiscount
  }).then((doc) => {
    res.json(doc);
  })
}

/* DELETE delete order by id */
exports.deleteOrderById = (req, res) => {
  Order.findByIdAndDelete(req.params.id).then((doc) => {
    res.json(doc);
  })
}

/* POST add status histroy */
exports.addStatusHistory = (req, res) => {
  const date = new Date();
  const body = req.body;
  let history = {};
  history.notes = body.notes
  history.updatedDate = date;
  // get static
  Order.findOne({ static: 'static' }).then((doc) => {
    history['statusInfo'] = doc.statuses.find((statObj) => {
      if (statObj.status == body.status) {
        return statObj
      }
    })
  }).then(() => {
    Order.updateOne({ _id: req.params.id },
      {
        $push: { statusHistory: history },
        'statusInfo.status': history.statusInfo.status,
        'statusInfo.color': history.statusInfo.color,
        updatedDate: date,
        "clientInfo.notes": history.notes
      }).then((value) => {
        res.json(value);
      })
  })
}
/* POST add array of history */
exports.addManyOfHistory = (req, res) => {
  let date = new Date();
  const body = req.body;
  const history = body.history;
  if (req.role == 'super-admin') {
    Order.updateMany({ $or: body.seqs, $nor: [{ static: 'static' }] }, {
      $push: { statusHistory: history },
      status: history.status,
      updatedDate: date,
    }).then((value) => {
      res.json(value);
    })
  } else {
    Order.updateMany({ $or: body.seqs, $nor: [{ static: 'static' }], "adminVerfied.adminId": { $eq: req.adminId } }, {
      $push: { statusHistory: history },
      status: history.status
    }).then((value) => {
      res.json(value);
    })
  }
}


/* GET get Invoices by passing the seqs of orders i checked it's about array of id's like: [1, 4, 9, etc..]; */
exports.getOrdersByPassTheSeqs = (req, res) => {
  let seqs = req.body;
  if (req.role == 'super-admin') {
    Order.find({ $nor: [{ static: 'static' }], seq: { $in: seqs } })
      .then((value) => {
        res.json(value);
      })
  } else {
    Order.find({ $nor: [{ static: 'static' }], "adminVerfied.adminId": { $eq: req.adminId }, seq: { $in: seqs } })
      .then((value) => {
        res.json(value);
      })
  }
}