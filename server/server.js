const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server  = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New User connected');

  //socket.emit from admin text say welcome to the chat app

  socket.emit('newMessage',{
    from:'Admin',
    text:'welcome to chat app',
    createdAt: new Date().getTime()
  });

  // socket brodcast.emit from admin text that new user has connected
  socket.broadcast.emit('newMessage',{
    from:'Admin',
    text:'New User Joined',
    createdAt: new Date().getTime()
  });


  socket.on('createMessage',(message) =>{
    console.log('createMessage',message);
    
     io.emit('newMessage',{
         from:message.from,
         text:message.text,
         createdAt:new Date().getTime()
     });

    // you can just send to all exept you
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt: new Date().getTime()
    // });
    
  });
  
  socket.on('disconnect',() => {
    console.log('User was disconnected');
    
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
  
});

