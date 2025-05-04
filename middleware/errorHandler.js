export function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error stack trace for debugging purposes
    
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is provided
    const message = err.message || "Internal server error";
  
    res.status(statusCode).json({
      error: true,
      message: message,
      details: err.details || null, // Optional additional information
    });
  }