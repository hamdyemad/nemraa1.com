const router = require('express').Router();
const homeController = require('../controllers/home.controller');
const verfication = require('../verfication/authorization')
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
const upload = multer({ storage }).any()

// GET get all carouselimg
router.get('/carousel', homeController.getAllCarousel)

// POST add new carousel img
router.post('/carousel', verfication.superAdminVerifyed, upload, homeController.addNewCarousel);

// PATCH toggle show of button
router.patch('/carousel/:id', homeController.toggleShowOfCarousel)

// DELETE remove carousel by id
router.delete('/carousel/:id', verfication.superAdminVerifyed, homeController.removeCarousel)


module.exports = router;