const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { errors, celebrate, Joi } = require('celebrate');

const cors = require('cors');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());

require('dotenv').config();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get(
  '/test',
  (req, res) => {
    res.send('test');
  },
);

app.all('*', (req, res) => {
  res.send({ msg: 'Ресурс не найден' });
});

// app.use(errors());

app.listen(PORT);
