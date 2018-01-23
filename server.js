var http = require('http'),
    path = require("path"),
    socketio = require('socket.io'),
    express = require('express'),
    router = express(),
    server = http.Server(router),
    io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function (socket) {
    console.log("Socket has connected to host");
  
    io.emit("joined");
    
    socket.on("join", function(){
      console.log("Peer has joined the room");
    });
    
    socket.on("callsdp", function(data){
      socket.to("webrtc.room").emit("callsdp", data);
    });
    
    socket.on("replysdp", function(data){
      socket.to("webrtc.room").emit("replysdp", data);
    });
    
    socket.on("candidate", function(data){
      socket.to("webrtc.room").emit("candidate", data);
    });
    
    socket.join("webrtc.room");
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("WebRTC server listening at", addr.address + ":" + addr.port);
});
