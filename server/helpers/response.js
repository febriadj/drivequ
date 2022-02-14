module.exports = ({
  res,
  message = null,
  payload = null,
  httpStatusCode = 200,
  success = true,
}) => {
  res.status(httpStatusCode).json({
    success,
    message,
    payload,
  });
};
