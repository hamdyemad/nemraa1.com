const router = require('express').Router();
const productsController = require('../controllers/products.controller');
const verfication = require('../verfication/authorization');
const multer = require('multer');

// Multer
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, files, cb) => {
        cb(null, Date.now() + '-' + files.originalname)
    }
})
const upload = multer({ storage }).fields([
    { name: 'image' },
    { name: 'otherImages' }
])

// GET get all categorys
router.get('/categorys', productsController.getAllCategorys)

// POST add new category
router.post('/categorys', productsController.addNewCategory)

// GET get product by options
router.get('/', productsController.getProductsByOptions);

// POST add new product
router.post('/', upload, productsController.addNewProduct)

// PATCH update product
router.patch('/:id', upload, productsController.updateProduct);

// DELETE delete product color
router.patch('/colors/:id', productsController.deleteColor)


// GET get product by id
router.get('/:id', productsController.getProductById)

// DELETE delete product by id
router.delete('/:id', productsController.deleteProduct)




module.exports = router;