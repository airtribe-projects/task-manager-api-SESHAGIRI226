const express = require("express")
const Task = require("../models/Tasks")
const { validateTask, validateTaskUpdate, validateId } = require("../middleware/validation")

const router = express.Router();
let tasks = []

// GET /tasks - Get all tasks with optional filtering
router.get("/", (req, res) => {
  try {
    let filteredTasks = [...tasks]

    // Filter by completion status
    if (req.query.completed !== undefined) {
      const isCompleted = req.query.completed === "true"
      filteredTasks = filteredTasks.filter((task) => task.completed === isCompleted)
    }

    // Filter by priority
    if (req.query.priority) {
      const priority = req.query.priority.toLowerCase()
      if (["low", "medium", "high"].includes(priority)) {
        filteredTasks = filteredTasks.filter((task) => task.priority === priority)
      }
    }

    // Search in title and description
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase()
      filteredTasks = filteredTasks.filter(
        (task) => task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm),
      )
    }

    // Sort by creation date (newest first by default)
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    if (["createdAt", "updatedAt", "title", "priority", "dueDate"].includes(sortBy)) {
      filteredTasks.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * sortOrder
        if (a[sortBy] > b[sortBy]) return 1 * sortOrder
        return 0
      })
    }

    // Pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

    res.json({
      tasks: paginatedTasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredTasks.length / limit),
        totalTasks: filteredTasks.length,
        hasNext: endIndex < filteredTasks.length,
        hasPrev: startIndex > 0,
      },
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve tasks",
      message: error.message,
    })
  }
})

// GET /tasks/:id - Get a single task
router.get("/:id", validateId, (req, res) => {
  try {
    const task = tasks.find((t) => t.id === req.params.id)

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
        message: `Task with ID ${req.params.id} does not exist`,
      })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve task",
      message: error.message,
    })
  }
})

// POST /tasks - Create a new task
router.post("/", validateTask, (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body

    const newTask = new Task(title, description, priority, dueDate)
    tasks.push(newTask)

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to create task",
      message: error.message,
    })
  }
})

// PUT /tasks/:id - Update a task
router.put("/:id", validateId, validateTaskUpdate, (req, res) => {
  try {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id)

    if (taskIndex === -1) {
      return res.status(404).json({
        error: "Task not found",
        message: `Task with ID ${req.params.id} does not exist`,
      })
    }

    const updatedTask = tasks[taskIndex].update(req.body)
    tasks[taskIndex] = updatedTask

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to update task",
      message: error.message,
    })
  }
})

// PATCH /tasks/:id - Partially update a task (more RESTful than PUT for partial updates)
router.patch("/:id", validateId, validateTaskUpdate, (req, res) => {
  try {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id)

    if (taskIndex === -1) {
      return res.status(404).json({
        error: "Task not found",
        message: `Task with ID ${req.params.id} does not exist`,
      })
    }

    // Store original task for comparison
    const originalTask = { ...tasks[taskIndex] }


    const updatedTask = tasks[taskIndex].update(req.body)
    tasks[taskIndex] = updatedTask
    const updatedFields = Object.keys(req.body).filter((key) =>
      ["title", "description", "completed", "priority", "dueDate"].includes(key),
    )

    res.json({
      message: "Task partially updated successfully",
      task: updatedTask,
      updatedFields: updatedFields,
      changes: updatedFields.reduce((acc, field) => {
        acc[field] = {
          from: originalTask[field],
          to: updatedTask[field],
        }
        return acc
      }, {}),
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to update task",
      message: error.message,
    })
  }
})

// DELETE /tasks/:id - Delete a task
router.delete("/:id", validateId, (req, res) => {
  try {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id)

    if (taskIndex === -1) {
      return res.status(404).json({
        error: "Task not found",
        message: `Task with ID ${req.params.id} does not exist`,
      })
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0]

    res.json({
      message: "Task deleted successfully",
      task: deletedTask,
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete task",
      message: error.message,
    })
  }
})

// DELETE /tasks - Delete all tasks (bulk delete)
router.delete("/", (req, res) => {
  try {
    const deletedCount = tasks.length
    tasks = []

    res.json({
      message: `Successfully deleted ${deletedCount} tasks`,
      deletedCount,
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete tasks",
      message: error.message,
    })
  }
})

module.exports = router
