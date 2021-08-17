const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const AuthError = require('../errors/auth-error');

const userSchema = new mongoose.Schema({
  // имя пользователя
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Имя',
  },
  // почта пользователя, по которой он регистрируется
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  // хеш пароля
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findAndCheck(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError('Неправильные почта или пароль');
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
