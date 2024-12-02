const express = require("express");
const router = express.Router();

const {createTask, getAllTasks, updateTask, deleteTask, getTasksByStatus} = require("../controllers/taskFlowController");

router.route("/").post(createTask)
router.route("/").get(getAllTasks)
router.route("/:id").put(updateTask)
router.route("/:id").delete(deleteTask)
router.route("/status/:status").get(getTasksByStatus);

module.exports = router;