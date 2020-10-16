const Order = require('../models/order.model');
/* POST Add new order but before we add the order we increament the sequence value and pass the end value to the newest order */
exports.addOrder = (req, res) => {
    Order.findOneAndUpdate({ static: 'static' }, { $inc: { seq: 1 } }).then((value) => {
        let seq = value.seq;
        const body = req.body;
        const orderObj = req.body.order;
        orderObj.totalPrice = orderObj.unitPrice * orderObj.amount
        let newOrder = new Order({
            seq: seq,
            order: orderObj,
            clientInfo: {
                name: body.clientInfo.name,
                address: body.clientInfo.address,
                mobile: body.clientInfo.mobile,
                city: body.clientInfo.city,
                comment: body.clientInfo.comment,
            }
        });
        newOrder
            .save()
            .then((doc) => {
                res.json(doc);
            })
    })
};

/* GET get all orders  */
exports.getAllOrders = (req, res) => {
    let query = req.query;
    console.log(query);
    if (Object.keys(query).length !== 0) {
        Order.find({
            $or: [
                { seq: query.id },
                { "clientInfo.name": new RegExp(`^${query.name}`) },
                { "clientInfo.city": query.city },
                { status: query.status },
                { addedDate: query.addedDate },
            ],
            $nor: [{ static: 'static' }]
        }).sort({ seq: -1 })
            .then((doc) => {
                res.json(doc);
            })
    } else {
        Order.find({ $nor: [{ static: 'static' }] }).sort({seq: -1})
            .then((value) => {
                res.json(value);
            })
    }
};

/* GET get order by id */
exports.getOrderById = (req, res) => {
    Order.findById(req.params.id).then((doc) => {
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
    updatedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
    const history = req.body;
    history.updatedDate = updatedDate;
    Order.findByIdAndUpdate(req.params.id,
        {
            $push: { statusHistory: history },
            status: history.status,
            comment: history.comment
        }).then((value) => {
            res.json(value);
        })
}

/* GET get Invoices by passing the seqs of orders i checked it's about array of id's like: [1, 4, 9, etc..]; */
exports.getOrdersByPassTheSeqs = (req, res) => {
    let seqs = req.body;
    Order.find({ $nor: [{ static: 'static' }], seq: { $in: seqs } })
        .then((value) => {
            res.json(value);
        })
}