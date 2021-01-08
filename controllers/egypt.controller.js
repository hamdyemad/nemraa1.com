const egyptModel = require('../models/egypt.model');
exports.addCities = (req, res) => {

    egyptModel.insertMany(cities).then((doc) => {
        res.json(doc);
    })

}


exports.getCities = (req, res) => {
    egyptModel.find({}).then((doc) => {
        res.json(doc);
    })
}