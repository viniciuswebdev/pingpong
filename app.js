var ejs = require('ejs'),
  express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app).listen(process.env.PORT || process.argv[2]),
  io = require('socket.io').listen(server);

app.configure(function () {
  app.set('view enginge','ejs');
  app.set('view options',{ layout:false });
  app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, resp){
  resp.render('index.ejs')
});

io.sockets.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });

  socket.on('key', function (data) {
    console.log(data);
  });

});