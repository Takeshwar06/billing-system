const express = require("express");
const { createBill, updateBill, getBills, deleteBill } = require("../controllers/bill.controller");

const router = express.Router();

router.route("/create-bill").post(createBill);
router.route("/update-bill").put(updateBill);
router.route("/get-bills").post(getBills);
router.route("/delet-bill/:id").delete(deleteBill);

module.exports = router;