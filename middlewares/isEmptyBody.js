const HttpError = require("../helpers/HttpError.js");

const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  console.log(req)
  if (!length) {
    return next(HttpError(400, req.method === 'PATCH' ? "missing field favorite" : "missing fields"));
  }
  next();
};

module.exports = {
  isEmptyBody
};
