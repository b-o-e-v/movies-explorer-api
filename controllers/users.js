const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const RequestError = require('../errors/request-error');
const ConflictError = require('../errors/conflict-error');
const AuthError = require('../errors/auth-error');

const {
  NOT_FOUND_USER,
  WRONG_EMAIL_OR_PASSWORD,
  VALIDATION_ERROR,
  EXIST_EMAIL,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.findOne({ email })
        .then((someUser) => {
          if (!someUser) {
            User.create({
              name,
              email,
              password: hash,
            }).then((user) => res.status(200).send({
              _id: user._id,
              name: user.name,
              email: user.email,
            }));
          } else {
            throw new ConflictError(EXIST_EMAIL);
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(() => {
      throw new AuthError(WRONG_EMAIL_OR_PASSWORD);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_USER);
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new RequestError(VALIDATION_ERROR);
  }
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError(NOT_FOUND_USER))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new RequestError(VALIDATION_ERROR);
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError(EXIST_EMAIL);
      }
    })
    .catch(next);
};
