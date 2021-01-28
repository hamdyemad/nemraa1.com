const router = require('express').Router();
const egyptController = require('../controllers/egypt.controller');
const verfication = require('../verfication/authorization');

/* GET get all cities */
router.get('/cities', egyptController.getCities);


// PATCH update free shpping status of cities
router.patch('/cities', verfication.superAdminVerifyed, egyptController.updateShipping)

/* POST add new city */
router.post('/city', verfication.superAdminVerifyed, egyptController.addCity);

/* PATCH update city */
router.patch('/city/:id', verfication.superAdminVerifyed, egyptController.updateCity)

/* DELETE delete city by id */
router.delete('/city/:id', verfication.superAdminVerifyed, egyptController.deleteCityById);


module.exports = router;