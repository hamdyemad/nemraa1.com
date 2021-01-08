const router = require('express').Router();
const egyptController = require('../controllers/egypt.controller');


router.post('/cities', egyptController.addCities);
router.get('/cities', egyptController.getCities);



module.exports = router;