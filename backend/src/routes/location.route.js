const express = require("express");
const { getLocations } = require("../controllers/location.controller");

const router = express.Router();

router.route("/get-locations").get(getLocations);

module.exports = router;