const router = require('express').Router();
const homeController = require('../controllers/home.controller');
const multer = require('multer');
// Multer
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/carousel-images')
    },
    filename: (req, files, cb) => {
        cb(null, Date.now() + '-' + files.originalname)
    }
})
const upload = multer({ storage }).array('carouselImgs');

// GET get all carouselimg
router.get('/carousel', homeController.getAllCarousel)

// POST add new carousel img
router.post('/carousel', upload, homeController.addNewCarousel);

// DELETE remove carousel img
router.delete('/carousel/:carouselImg', homeController.removeCarousel)


module.exports = router;