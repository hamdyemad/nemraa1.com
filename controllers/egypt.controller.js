const egyptModel = require('../models/egypt.model');


// update city

exports.updateCity = (req, res) => {
    const body = req.body;
    egyptModel.findByIdAndUpdate(req.params.id, { city: body.city, price: body.price }).then((doc) => {
        res.json({ message: `${body.city} تم تعديله` });
    })
}

// add new city
exports.addCity = (req, res) => {
    const body = req.body;
    egyptModel.findOne({ city: body.city }).then((doc) => {
        if (doc) {
            res.json({ message: 'يوجد مدينة بنفس الأسم !' })
        } else {
            let newCity = new egyptModel({
                city: body.city,
                price: body.price
            });
            newCity.save().then((val) => {
                res.json({ message: `تم اضافة ${body.city}` })
            })
        }
    })
}

// get all cities
exports.getCities = (req, res) => {
    egyptModel.find({}).sort({ addedDate: -1, city: 1 }).then((doc) => {
        res.json(doc);
    })
}

// delete city by id
exports.deleteCityById = (req, res) => {
    egyptModel.findByIdAndRemove(req.params.id).then((doc) => {
        res.json(doc)
    })
}