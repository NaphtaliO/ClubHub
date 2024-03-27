const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config();
const path = require('path');

const port = process.env.PORT || 5000;
const uri = process.env.URI;

//express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

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
    // app.listen((port), () => {
    //   //listening for requests
    //   console.log(`Connected to db and listening on port ${port}.`);
    // });
    httpServer.listen((port), () => {
      //listening for requests
      console.log(`Connected to db and listening on port ${port}.`);
    });
  }).catch((e) => {
    console.log(e);
  });

io.on("connection", (socket) => {
  // console.log('Client connected ' + socket.id);

  socket.on('streaming', (data) => {
    const { eventId } = data;
    io.to(eventId).emit(`streaming:${eventId}`, { message: 'Live stream started for this event' })
    // Notify student clients about live stream for this event
    socket.broadcast.emit(`streaming:${eventId}`, { message: 'Live stream started for this event' });
  });

  socket.on('stopStreaming', (data) => {
    const { eventId } = data;
    // Notify student clients about live stream for this event
    io.emit(`stopStreaming:${eventId}`, { message: 'Stream Ended' });
  });
});

// V1 routes
app.use('/api/v1/auth', require('./src/api/v1/routes/auth.route'));
app.use('/api/v1/post', require('./src/api/v1/routes/post.route'));
app.use('/api/v1/event', require('./src/api/v1/routes/event.route'));
app.use('/api/v1/user', require('./src/api/v1/routes/user.route'));
app.use('/api/v1/comment', require('./src/api/v1/routes/comment.route'));
app.use('/api/v1/notification', require('./src/api/v1/routes/notification.route'));