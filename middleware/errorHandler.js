const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  
  let error = {
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  }

  
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    error = {
      status: 400,
      message: "Invalid JSON format",
    }
  }

  
  if (err.code === "LIMIT_FILE_SIZE") {
    error = {
      status: 413,
      message: "Request entity too large",
    }
  }

  res.status(error.status).json({
    error: error.message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  })
}

module.exports = errorHandler
