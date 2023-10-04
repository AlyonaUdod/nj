const { Schema, model } = require('mongoose');
const Joi = require('joi');

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', (error, data, next) => {
  const { name, code } = error;
  if (name === 'MongoServerError' && code === 11000) {
    error.status = 409;
    error.message = 'Email in use';
  } else {
    error.status = 400;
  }
  next();
});

const joiSignupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
  substrcription: Joi.string(),
});

const joiLoginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
});

const joiSubscriprtion = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const User = model('user', userSchema);

module.exports = {
  User,
  joiSignupSchema,
  joiLoginSchema,
  joiSubscriprtion,
};