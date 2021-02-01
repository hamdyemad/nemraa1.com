const egyptModel = require('../models/egypt.model');


//updateShipping

exports.updateShipping = (req, res) => {
  let status = req.body.status;
  let io = req.app.get('io');

  egyptModel.find({}).then((doc) => {
    for (let city of doc) {
      egyptModel.findByIdAndUpdate(city._id, { freeShipping: status }).then()
    }
  }).then(() => {
    io.emit('cities');

    if (status == true) {
      res.json({ message: 'تم تفعيل الشحن المجانى' })
    } else {
      res.json({ message: 'تم الغاء الشحن المجانى' })
    }
  })
}


// update city
exports.updateCity = (req, res) => {
  let io = req.app.get('io');
  const body = req.body;
  body.city = body.city.toLowerCase();
  egyptModel.findByIdAndUpdate(req.params.id, { city: body.city, price: body.price, shippingTime: body.shippingTime }).then(() => {
    io.emit('cities');
    res.json({ message: `${body.city} تم تعديل` });
  })
}
// add new city
exports.addCity = (req, res) => {
  const body = req.body;
  let io = req.app.get('io');
  body.city = body.city.toLowerCase();
  egyptModel.findOne({ city: body.city }).then((doc) => {

    if (doc) {
      res.json({ errMessage: '! يوجد مدينة بنفس الأسم' })
    } else {
      let newCity = new egyptModel({
        city: body.city,
        price: body.price,
        shippingTime: body.shippingTime
      });
      newCity.save().then(() => {
        io.emit('cities');
        res.json({ message: `${body.city} تم اضافة` })
      })
    }
  })
}

// get all cities
exports.getCities = (req, res) => {
  egyptModel.find({}).sort({ addedDate: -1, city: 1 }).then((doc) => {
    res.json(doc);
  });
}

// delete city by id
exports.deleteCityById = (req, res) => {
  let io = req.app.get('io');
  egyptModel.findByIdAndRemove(req.params.id).then((doc) => {
    io.emit('cities');
    res.json(doc)
  })
}