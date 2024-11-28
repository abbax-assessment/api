require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const { Router } = require("express")
const tasksRouter = require("./tasks");
const router = Router();

router.use("/tasks", tasksRouter);

module.exports = router;