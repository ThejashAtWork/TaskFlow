const asyncHandler = require("express-async-handler");

const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const TASK_FILE = "./data/tasks.json";
console.log(TASK_FILE);

// function to read tasks from file
const readTasksFromFile = () => {
    if (!fs.existsSync(TASK_FILE)) {
        return [];
    }
    const data = fs.readFileSync(TASK_FILE);
    return JSON.parse(data.toString());
};

// function to write tasks to file
const writeTasksToFile = (tasks) => {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
};


//@desc  create new Task Flow
//@route post /tasks
//@access public 
const createTask = asyncHandler(async(req, res) => {
    const {title, description} = req.body;
    if(!title || !description) {
        res.status(400);
        throw new Error("All fileds are mandatory")
    }
    
    const tasks = readTasksFromFile();
    const newTask = {
        id: uuidv4(), // Generate unique ID
        title: title,
        description:description,
        status: "pending"
    };
    tasks.push(newTask);
    writeTasksToFile(tasks); // Save the new task
    res.status(201).json(newTask);
})

//@desc  Get All Tasks
//@route GET /tasks
//@access public 
const getAllTasks = asyncHandler(async(req, res) => {
    const tasks = readTasksFromFile();
    res.json(tasks);
})

//@desc  Update Task
//@route PUT  /tasks/:id
//@access public 
const updateTask = asyncHandler(async (req, res) => {
    try {
        const tasks = readTasksFromFile(); // Read existing tasks
        const taskId = req.params.id; // Extract task ID from URL

        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }

        const task = tasks.find((t) => t.id === taskId); // Find the task by ID

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const newStatus = req.body.status?.toLowerCase(); // Get status from request body
        if (newStatus === "pending" || newStatus === "completed") {
            task.status = newStatus; // Update the status
            writeTasksToFile(tasks); // Save updated tasks back to file
            return res.json({
                message: "Task status updated successfully",
                task: task,
            });
        } else {
            return res.status(400).json({
                message: "Invalid status. Use 'pending' or 'completed'.",
            });
        }
    } catch (error) {
        console.error("Error updating task:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//@desc  delete a Task
//@route DELETE  /tasks/:id
//@access public 

const deleteTask = asyncHandler(async (req, res) => {
    try {
        const tasks = readTasksFromFile(); // Read existing tasks
        const taskId = req.params.id; // Extract task ID from URL

        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }

        const taskIndex = tasks.findIndex((t) => t.id === taskId); // Find the task index by ID

        if (taskIndex === -1) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Remove the task
        const deletedTask = tasks.splice(taskIndex, 1);
        writeTasksToFile(tasks); // Save the updated tasks back to file

        res.json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

//@desc  Filter Tasks by Status
//@route  GET : /tasks/status/:status 
//@access public 

const getTasksByStatus = asyncHandler(async (req, res) => {
    try {
        const tasks = readTasksFromFile(); // Read all tasks from the file
        const status = req.params.status?.toLowerCase(); // Extract and normalize status from URL

        if (status !== "pending" && status !== "completed") {
            return res.status(400).json({ message: "Invalid status. Use 'pending' or 'completed'." });
        }

        const filteredTasks = tasks.filter((task) => task.status === status); // Filter tasks by status
        res.json(filteredTasks); // Return matching tasks (can be an empty array)
    } catch (error) {
        console.error("Error retrieving tasks by status:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = { createTask, getAllTasks, updateTask, deleteTask, getTasksByStatus};