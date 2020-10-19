const router = require("express").Router();
const verfication = require("../verfication/authorization");
const ordersController = require("../controllers/orders.controller");

/* POST add order  */
router.post('/', ordersController.addOrder);

/* GET get all orders && by query  */
router.get("/", verfication.verifyed, ordersController.getAllOrders);

/* GET get static */
router.get('/static', verfication.verifyed, ordersController.getStatic);

/* PATCH update statused of static */
router.patch('/static', verfication.superAdminVerifyed, ordersController.updateStatuses);


/* GET get orders invoices */
router.post('/invoices', verfication.verifyed, ordersController.getOrdersByPassTheSeqs);

/* GET get order by id */
router.get('/:id', verfication.verifyed, ordersController.getOrderById);


/* PATCH update order by id */
router.patch('/:id', verfication.superAdminVerifyed, ordersController.editOrder);



/* DELETE delete order by id */
router.delete('/:id', verfication.superAdminVerifyed, ordersController.deleteOrderById);

/* POST add status histroy */
router.post('/history/:id', verfication.verifyed, ordersController.addStatusHistory);

module.exports = router;