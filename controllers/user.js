
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../schemas/userSchemas');
const HttpError = require("../helpers/HttpError");
const { ctrlWrapper } = require("../decorators/ctrlWrapper");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  let hashPassword = '';
  if (password) {
    hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
  const result = await User.create({ email, subscription, password: hashPassword });
  res.status(201).json({
    user: {
      email,
      subscription: result.subscription,
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCompare = user ? bcrypt.compareSync(password, user.password) : null;
  if (!user || !passwordCompare) {
    throw HttpError(401, 'Email or password is wrong')
  };
  const { subscription } = user;
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email,
      subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.sendStatus(204);
};

const changeSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;
  const updatedUser = await User.findOneAndUpdate({ _id }, { subscription }, { new: true });
  res.status(200).json({
    emai: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  changeSubscription: ctrlWrapper(changeSubscription),
};
