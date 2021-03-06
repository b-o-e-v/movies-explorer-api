const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const { NEED_TO_AUTHORIZE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthError(NEED_TO_AUTHORIZE);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new AuthError(NEED_TO_AUTHORIZE);
  }
  req.user = payload;
  next();
};
