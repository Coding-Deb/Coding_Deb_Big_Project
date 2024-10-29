// const asyncHandler = (requestHandler) => {
//   return (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//   };
// };

// export { asyncHandler };

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error(error);

    // Customize error response based on environment (production vs. development)
    if (process.env.NODE_ENV === "production") {
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    } else {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error, // Send detailed error in development
        message: error.message,
      });
    }
  }
};

export { asyncHandler };
