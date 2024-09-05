const express = require("express");
const { getItems, createItems } = require("../controllers/item.controller");

const router = express.Router();

router.route("/get-items").get(getItems);
router.route("/create-items").post(createItems);

module.exports = router;