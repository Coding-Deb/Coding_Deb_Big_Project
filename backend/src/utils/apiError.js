// class ApiError extends Error {
//     constructor(
//         statusCode,
//         message= "Something went wrong",
//         errors = [],
//         stack = ""
//     ){
//         super(message)
//         this.statusCode = statusCode
//         this.data = null
//         this.message = message
//         this.success = false;
//         this.errors = errors

//         if (stack) {
//             this.stack = stack
//         } else{
//             Error.captureStackTrace(this, this.constructor)
//         }

//     }
// }

// export {ApiError}

function apiError(
  res,
  statusCode = 500,
  message = "An error occurred",
  error = null
) {
  // Validate statusCode
  if (typeof statusCode !== "number" || statusCode < 100 || statusCode > 599) {
    statusCode = 500; // Default to internal server error
  }

  // Ensure message and error are strings
  if (typeof message !== "string") {
    message = "An error occurred";
  }

  if (error && typeof error !== "string") {
    error = JSON.stringify(error); // Convert error object to string
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
}

export default apiError;
