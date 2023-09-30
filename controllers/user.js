
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');

const { User } = require('../schemas/userSchemas');
const HttpError = require("../helpers/HttpError");
const { ctrlWrapper } = require("../decorators/ctrlWrapper");
const { jimpsAvatar } = require('../helpers/jimpsAvatar');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  let hashPassword = '';
  if (password) {
    hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
  const avatarUrl = gravatar.url(email);
  const result = await User.create({ email, subscription, password: hashPassword, avatarUrl });
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
  console.log(user)
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email,
      subscription
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

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;

  try {
    await jimpsAvatar(tempUpload);
    const resultUpload = path.join(__dirname, '../', 'public', 'avatars', imageName);
    console.log(resultUpload)
    await fs.rename(tempUpload, resultUpload);
    const avatarUrl = path.join('avatars', imageName);
    await User.findByIdAndUpdate(req.user._id, { avatarUrl });
    res.json({ avatarUrl });
  } catch (error) {
    await fs.unlink(tempUpload);
    console.log(error);
    throw error;
  }
};


module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  changeSubscription: ctrlWrapper(changeSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
