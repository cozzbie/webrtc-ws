(function(){
    
    // An Alice and Bobs illustration in WebRTC
    
    var socket = io(), //Our Socket.io reference
        localvid = document.querySelector("#localvid"), // The Local Videos container
        remotevid = document.querySelector("#remotevid"), // The Remote Videos container
        callbtn = document.querySelector("#callbtn"),  // Call button to initiat a call to Bob
        localstream, // Reference to the local stream that we send to Bob
        remotestream, // Reference to the Bobs stream that he sends to Alice
        peer,
        constraints = { audio: 0, video: 1 },
        iceservers = {
            iceServers: [ 
                { url: 'stun:stun.l.google.com:19302' },
                { url: 'turn:numb.viagenie.ca', credential: 'crib13@', username: 'cozzbie@gmail.com' }
            ]
          };
    
          
    function call() {}
    
    function reply() {}
    
    
    socket.on("joined", function(){
        console.log("Peer has joined the room");
    });
    
    socket.on("callsdp", function(data){ // Offer sent by Alice to Bob
        
    });
    
    socket.on("replysdp", function(data){ // Answer sent by Bob back to Alice
        
    });
    
    socket.on("candidate", function(data){ // What we do when we receive a sessions candidate.
        
    });
    
    callbtn.addEventListener("click", function(){
        
    });
    
    
          
})();