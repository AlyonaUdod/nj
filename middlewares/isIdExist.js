const HttpError = require("../helpers/HttpError.js");
const { isValidObjectId } = require('mongoose');

const isIdExist = (req, res, next) => {
  const item = isValidObjectId(req.params.contactId);
  console.log(item)
  if (!item) {
    return next(HttpError(404, "Not found"));
  }
  next();
};

module.exports = {
  isIdExist
};
