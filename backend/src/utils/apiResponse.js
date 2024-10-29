export default function apiResponse(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({ message, data });
}