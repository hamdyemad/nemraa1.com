const egyptModel = require('../models/egypt.model');


// update city

exports.updateCity = (req, res) => {
  let io = req.app.get('io');
  const body = req.body;
  body.city = body.city.toLowerCase();
  egyptModel.findByIdAndUpdate(req.params.id, { city: body.city, price: body.price }).then(() => {
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
        price: body.price
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