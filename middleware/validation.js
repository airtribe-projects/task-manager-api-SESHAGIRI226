const validateTask = (req, res, next) => {
  const { title, priority, dueDate } = req.body
  const errors = []

 
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("Title is required and must be a non-empty string")
  } else if (title.length > 200) {
    errors.push("Title must be less than 200 characters")
  }

  if (priority && !["low", "medium", "high"].includes(priority)) {
    errors.push("Priority must be one of: low, medium, high")
  }

 
  if (dueDate) {
    const date = new Date(dueDate)
    if (isNaN(date.getTime())) {
      errors.push("Due date must be a valid ISO date string")
    }
  }

  if (req.body.description && req.body.description.length > 1000) {
    errors.push("Description must be less than 1000 characters")
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    })
  }

  next()
}

const validateTaskUpdate = (req, res, next) => {
  const { title, priority, dueDate, completed } = req.body
  const errors = []

  // Check if at least one field is provided for update
  const updateFields = ["title", "description", "completed", "priority", "dueDate"]
  const hasValidUpdate = updateFields.some((field) => req.body.hasOwnProperty(field))

  if (!hasValidUpdate) {
    errors.push("At least one field must be provided for update")
  }

  if (title !== undefined) {
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      errors.push("Title must be a non-empty string")
    } else if (title.length > 200) {
      errors.push("Title must be less than 200 characters")
    }
  }

  // Validate priority if provided
  if (priority !== undefined && !["low", "medium", "high"].includes(priority)) {
    errors.push("Priority must be one of: low, medium, high")
  }

  // Validate completed if provided
  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("Completed must be a boolean value")
  }

  // Validate dueDate if provided
  if (dueDate !== undefined && dueDate !== null) {
    const date = new Date(dueDate)
    if (isNaN(date.getTime())) {
      errors.push("Due date must be a valid ISO date string")
    }
  }

  // Validate description length if provided
  if (req.body.description !== undefined && req.body.description.length > 1000) {
    errors.push("Description must be less than 1000 characters")
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    })
  }

  next()
}

const validateId = (req, res, next) => {
  const { id } = req.params

  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return res.status(400).json({
      error: "Invalid ID",
      message: "Task ID must be a non-empty string",
    })
  }

  next()
}

module.exports = {
  validateTask,
  validateTaskUpdate,
  validateId,
}
