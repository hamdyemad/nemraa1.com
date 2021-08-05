const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const verfication = require("../verfication/authorization");

/* POST register */
router.post(
  "/register",
  verfication.superAdminVerifyed,
  authController.register
);

/* POST login */
router.post("/login", authController.login);

/* GET get all admins */
router.get(
  "/admins",
  verfication.superAdminVerifyed,
  authController.getAllAdmins
);

/* GET get all sub-admins */
router.get("/subAdmins", verfication.verifyed, authController.getSubAdmins);

/* GET get admin info */
router.get("/admin", verfication.verifyed, authController.getAdminInfo);

/* PATCH update role */
router.patch(
  "/admins/role/:id",
  verfication.superAdminVerifyed,
  authController.updateRole
);

/* DELETE admin */
router.delete(
  "/admins/:id",
  verfication.superAdminVerifyed,
  authController.deleteAdmin
);

module.exports = router;
