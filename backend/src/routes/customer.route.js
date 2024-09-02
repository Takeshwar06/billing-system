const express = require("express");
const { getCustomers, getCustomersLocationsItemsBrands } = require("../controllers/customer.controller");

const router = express.Router();

router.route("/get-customers").get(getCustomers);
router.route("/get-all").get(getCustomersLocationsItemsBrands);

module.exports = router;  