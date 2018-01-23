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
    
    // Alert sockets join
    socket.on("join", function(){
      console.log("Peer has joined the room");
    });
    
    // The callers session description protocol
    socket.on("callsdp", function(data){
      socket.to("webrtc.room").emit("callsdp", data);
    });
    
    // The reply SDP
    socket.on("replysdp", function(data){
      socket.to("webrtc.room").emit("replysdp", data);
    });
    
    // Transfer of ICE Candidates
    socket.on("candidate", function(data){
      socket.to("webrtc.room").emit("candidate", data);
    });
    
    
    // Add the socket to some arbitrary room
    socket.join("webrtc.room");
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("WebRTC server listening at", addr.address + ":" + addr.port);
});
