class Task {
  constructor(title, description = "", priority = "medium", dueDate = null) {
    this.id = Task.generateId()
    this.title = title
    this.description = description
    this.completed = false
    this.priority = priority
    this.dueDate = dueDate
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  update(updates) {
    const allowedUpdates = ["title", "description", "completed", "priority", "dueDate"]

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        this[key] = updates[key]
      }
    })

    this.updatedAt = new Date().toISOString()
    return this
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

module.exports = Task
