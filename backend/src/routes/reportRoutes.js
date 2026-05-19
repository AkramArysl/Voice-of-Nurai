const express = require("express");
const reportController = require("../controllers/reportController");
const checkAuth = require("../middlewares/checkAuth");
const validate = require("../middlewares/validate");
const { createReportSchema } = require("../validators/reportValidator");

const router = express.Router();

router.get("/", reportController.getAll);
router.post(
	"/",
	checkAuth,
	validate(createReportSchema),
	reportController.create,
);
router.delete("/:id", checkAuth, reportController.remove);

module.exports = router;
