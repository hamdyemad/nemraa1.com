const router = require("express").Router();
const verfication = require("../verfication/authorization");
const ordersController = require("../controllers/orders.controller");

/* POST add order  */
router.post('/', ordersController.addOrder);

/* POST post add orders to admins view */
router.post("/admins", verfication.superAdminVerifyed, ordersController.addOrderShowWithAdmin)

/* PATCH update orders to admins view */
router.patch('/admins', verfication.superAdminVerifyed, ordersController.removeOrderShowWithAdmin)

/* GET get all orders && by query  */
router.get("/", verfication.verifyed, ordersController.getAllOrders);

/* GET get all completed orders */
router.get("/completed", verfication.verifyed, ordersController.getAllCompletedOrders);


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
router.post('/history/details/:id', verfication.verifyed, ordersController.addStatusHistory);

/* POST add many of history */
router.post('/history', verfication.verifyed, ordersController.addManyOfHistory)

module.exports = router;