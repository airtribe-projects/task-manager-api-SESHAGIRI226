# Task Management API

A RESTful API for managing tasks built with Node.js and Express.js. This API provides full CRUD operations, input validation, error handling, and filtering capabilities with in-memory data storage.

#### Get All Tasks
- **GET** `/tasks`
- **Query Parameters:**
  - `completed`: Filter by completion status (`true`/`false`)
  - `priority`: Filter by priority (`low`, `medium`, `high`)
  - `search`: Search in title and description
  - `sortBy`: Sort field (`createdAt`, `updatedAt`, `title`, `priority`, `dueDate`)
  - `sortOrder`: Sort order (`asc`, `desc`)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

**Example:**
\`\`\`bash
curl "http://localhost:3000/tasks?completed=false&priority=high&page=1&limit=5"
\`\`\`

#### Get Single Task
- **GET** `tasks/:id`

**Example:**
\`\`\`bash
curl http://localhost:3000/tasks/1234567890
\`\`\`

#### Create Task
- **POST** `/tasks`
- **Body (JSON):**
  \`\`\`json
  {
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z"
  }
  \`\`\`

**Example:**
\`\`\`bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z"
  }'
\`\`\`

#### Update Task
- **PUT** `/tasks/:id`
- **Body (JSON):** Any combination of updatable fields
  \`\`\`json
  {
    "title": "Updated task title",
    "completed": true,
    "priority": "medium"
  }
  \`\`\`

**Example:**
\`\`\`bash
curl -X PUT http://localhost:3000/api/tasks/1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "priority": "low"
  }'
\`\`\`

#### Partially Update Task (PATCH)
- **PATCH** `/tasks/:id`
- **Body (JSON):** Only the fields you want to update
  \`\`\`json
  {
    "completed": true
  }
  \`\`\`

**Example:**
\`\`\`bash
curl -X PATCH http://localhost:3000/api/tasks/1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
\`\`\`

**Success Response:**
\`\`\`json
{
  "message": "Task partially updated successfully",
  "task": {
    "id": "1234567890",
    "title": "Learn Node.js",
    "description": "Complete tutorial",
    "completed": true,
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:20:00.000Z"
  },
  "updatedFields": ["completed"],
  "changes": {
    "completed": {
      "from": false,
      "to": true
    }
  }
}
\`\`\`

**Difference between PUT and PATCH:**
- **PUT**: Replaces the entire resource (should include all fields)
- **PATCH**: Applies partial modifications to a resource (only changed fields)

#### Delete Task
- **DELETE** `tasks/:id`

**Example:**
\`\`\`bash
curl -X DELETE http://localhost:3000/api/tasks/1234567890
\`\`\`

#### Delete All Tasks
- **DELETE** `/tasks`

**Example:**
\`\`\`bash
curl -X DELETE http://localhost:3000/api/tasks
\`\`\`

## Task Schema

\`\`\`json
{
  "id": "string (auto-generated)",
  "title": "string (required, max 200 chars)",
  "description": "string (optional, max 1000 chars)",
  "completed": "boolean (default: false)",
  "priority": "string (low|medium|high, default: medium)",
  "dueDate": "string (ISO date, optional)",
  "createdAt": "string (ISO date, auto-generated)",
  "updatedAt": "string (ISO date, auto-updated)"
}
\`\`\`

## Validation Rules

### Creating Tasks
- **title**: Required, non-empty string, max 200 characters
- **description**: Optional, max 1000 characters
- **priority**: Optional, must be `low`, `medium`, or `high`
- **dueDate**: Optional, must be valid ISO date string

### Updating Tasks
- At least one field must be provided
- **title**: If provided, must be non-empty string, max 200 characters
- **description**: If provided, max 1000 characters
- **completed**: If provided, must be boolean
- **priority**: If provided, must be `low`, `medium`, or `high`
- **dueDate**: If provided, must be valid ISO date string or null

1. **New Routes**: Add to `routes/tasks.js`
2. **Validation**: Update `middleware/validation.js`
3. **Models**: Modify `models/Task.js`
4. **Error Handling**: Update `middleware/errorHandler.js`

