// utils/handleErrors.js
export const handleErrors = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;  // Default to 500 if no custom statusCode is set
    const message = err.message || 'Internal Server Error';  // Default message
  
    console.error("Error:", err);  // Log the error for debugging purposes
  
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: message,
    });
  };
  