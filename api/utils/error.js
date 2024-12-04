export const errorHandler = (statusCode, message) => {
    const error = new Error(message); // Set the message during Error creation
    error.statusCode = statusCode;    // Add a custom statusCode property
    return error;
};
