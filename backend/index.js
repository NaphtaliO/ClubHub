const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const port = process.env.PORT || 5000;
const uri = process.env.URI;

//express app
const app = express();

// const router = express.Router();

//express middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))

//Connect to db
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen((port), () => {
      //listening for requests
      console.log(`Connected to db and listening on port ${port}.`);
    });
  }).catch((e) => {
    console.log(e);
  });

// V1 routes
app.use('/api/v1/auth', require('./src/api/v1/routes/auth.route'));
app.use('/api/v1/post', require('./src/api/v1/routes/post.route'));
// app.use('/api/v1/user', require('./src/api/v1/routes/user.route'));