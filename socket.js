const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PouchDB = require('pouchdb');
const db = new PouchDB('socketdb');
let numberOfMessages = 0;
let n = numberOfMessages;

doc = {
  _id: '101'
}

db.put(doc, function(err, res){
  if(err){
    console.log(err)
  } else {
    console.log('msg sent');
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  //getfromdb
    db.get('101', function(err,docu){
      if(err) {
        console.log('Diego dice que tienes un error. Arreglalo AHORA!');
        console.log(err);
      } else {
        var keys = [];
        var values = [];
        for(var value in docu){
          values.push(docu[value]);
          console.log(docu[value]);
        }
        for(var key in docu){
          keys.push(key);
          console.log('------------')
          console.log(key);
        }
        for(let c = 0; c < keys.length; c++){
          if(keys[c] != '_id' && keys[c] != '_rev' && keys[c] != 'numberOfMessages'){
            io.emit('chat message', values[c]);
          }
        }
        console.log(docu);
      }
    })
  //getfromdb
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      //db
      db.get('101', function(err,docu){
        if(err){
          console.log('Diego dice que tienes un error. Arreglalo AHORA!');
          console.log(err);
        } else {
          docu['message' + n.toString()] = msg;
          console.log(n);
          console.log(areYouConnected);
          n += 1;
          return db.put(docu, function(error,res){
            if(error) {
              console.log('Diego dice que tienes un error. Arreglalo AHORA!');
              console.log(error);
            } else {
              console.log('msg saved!');
            }
          })
        }
      })
      //db
      console.log('message: ' + msg);
    });
  });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
});