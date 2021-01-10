const router = require('express').Router();
const egyptController = require('../controllers/egypt.controller');

/* GET get all cities */
router.get('/cities', egyptController.getCities);
/* POST add new city */
router.post('/city', egyptController.addCity);

/* PATCH update city */
router.patch('/city/:id', egyptController.updateCity)

/* DELETE delete city by id */
router.delete('/city/:id', egyptController.deleteCityById);


module.exports = router;