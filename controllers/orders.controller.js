const Order = require('../models/order.model');
const Product = require('../models/products.model');
/* POST Add new order but before we add the order we increament the sequence value and pass the end value to the newest order */
exports.addOrder = (req, res) => {
  Order.findOneAndUpdate({ static: 'static' }, { $inc: { seq: 1 } }).then((value) => {
    let seq = value.seq;
    const body = req.body;
    const products = body.products;
    let io = req.app.get('io');

    for (let product of products) {
      Product.findById(product.productId).then((doc) => {
        Product.updateOne({ _id: doc._id }, { amount: doc.amount - product.totalAmount }).then()
      })
    }
    body['seq'] = seq;
    body['orderPrice'] = products.map((product) => {
      return product.totalPrice
    }).reduce((acc, current) => acc + current);
    body['orderShippingPrice'] = body['orderPrice'] + body.shipping;
    let newOrder = new Order(body);
    newOrder
      .save()
      .then((doc) => {
        Order.findOneAndUpdate({ static: 'static' }, { $addToSet: { cities: doc.clientInfo.city } }).then(() => {
          io.emit('orders');
          res.json({ message: `تم اضافة طلب ${doc.clientInfo.clientName} بنجاح` });
        });
      })
  })
};

/* PATCH update order by id */
exports.updateOrderById = (req, res) => {
  const body = req.body;
  let io = req.app.get('io');

  Order.findById(req.params.id).then((doc) => {
    Order.updateOne({ _id: doc._id }, {
      'clientInfo.clientName': body.clientInfo.clientName,
      'clientInfo.mobile': body.clientInfo.mobile,
      'clientInfo.city': body.clientInfo.city,
      'clientInfo.address': body.clientInfo.address,
      'clientInfo.notes': body.clientInfo.notes,
      shipping: body.shipping,
      products: body.products
    }).then((val) => {
      io.emit('orders')
      res.json({ message: `تم تعديل ${body.clientInfo.clientName} بنجاح` });
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


/* GET get static*/
exports.getStatic = (req, res) => {
  Order.findOne({ static: 'static' }).then((doc) => {
    res.json(doc);
  })
}

/* PATCH  update all statuese of static */
exports.updateStatuses = (req, res) => {
  Order.findOneAndUpdate({ static: 'static' }, { $addToSet: { statuses: req.body } }).then((doc) => {
    res.json(doc);
  })
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
  let io = req.app.get('io');

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
        io.emit('orders')
        res.json(value);
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
  Order.updateMany({ $or: body.seqs, $nor: [{ static: 'static' }] },
    {
      $push: { statusHistory: history },
      'statusInfo.status': history.statusInfo.status,
      'statusInfo.color': history.statusInfo.color,
      updatedDate: date,
    }).then((value) => {
      io.emit('orders')
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