var ejs = require('ejs'),
  express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app).listen(process.env.PORT || process.argv[2]),
  io = require('socket.io').listen(server);

var users = [];

app.configure(function () {
  app.set('view enginge','ejs');
  app.set('view options',{ layout:false });
  app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, resp){
  resp.render('index.ejs')
});

io.sockets.on('connection', function (socket) {
  
  socket.on('first', function (data) {
    users.push({'id':socket.id, 'ready':false});
    console.log(users);
  });

  socket.on('disconnect', function() {
      for(var i in users){
        if(users[i].id == socket.id){
          users.splice(i, 1);
        }
      }
   });

  socket.on('ready', function (data) {
      for(var i in users){
        if(users[i].id == socket.id){
          users[i].ready = true;
        }
      }

      for(var i in users){
        if(!users[i].ready){
          return;
        }        
      }

      io.sockets.emit('start', data );
  });

  socket.on('key', function (data) {
      socket.broadcast.emit('key', data );
  });

});