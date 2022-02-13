module.exports = ({
  res,
  message = null,
  data = null,
  httpStatusCode = 200,
  success = true,
}) => {
  res.status(httpStatusCode).json({
    success,
    message,
    data,
  });
};
