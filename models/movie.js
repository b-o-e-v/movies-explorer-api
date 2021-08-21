const mongoose = require('mongoose');
const validator = require('validator');
const { REQUIRED, IS_LINK } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, REQUIRED],
  },
  director: {
    type: String,
    required: [true, REQUIRED],
  },
  duration: {
    type: Number,
    required: [true, REQUIRED],
  },
  year: {
    type: Number,
    required: [true, REQUIRED],
  },
  description: {
    type: String,
    required: [true, REQUIRED],
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: IS_LINK,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: IS_LINK,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: IS_LINK,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, REQUIRED],
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: [true, REQUIRED],
    unique: true,
  },
  nameRU: {
    type: String,
    required: [true, REQUIRED],
  },
  nameEN: {
    type: String,
    required: [true, REQUIRED],
  },
});

module.exports = mongoose.model('movie', movieSchema);
