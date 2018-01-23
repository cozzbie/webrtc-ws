(function(){
    
    var socket = io(),
    
        // Container for the local stream
        localvid = document.querySelector("#localvid"),
        
        // Container for the video from the remote peer
        remotevid = document.querySelector("#remotevid"),
        
        // We will be using this to make a call to the peer.
        callbtn = document.querySelector("#callbtn"),
        
        // Reference to the localstream
        localstream,
        
        // Reference to the remote
        remotestream,
        
        // The peers object
        peer,
        
        // Media Constraints to access
        constraints = { audio: 0, video: 1 },
        
        // ICE server addresses for our STUNs and TURNs
        iceservers = {
            iceServers: [ 
                { url: 'stun:stun.l.google.com:19302' },
                { url: 'turn:numb.viagenie.ca', credential: 'crib13@', username: 'cozzbie@gmail.com' }
            ]
          };
      
      // Create a peer connection
      function createPeer(){
          peer = new RTCPeerConnection(iceservers);
          
          // Runs when the peers information is available. At this point sharing can begin
          peer.onicecandidate = function(e){
              if(e.candidate) socket.emit("candidate", e.candidate);
          }
          
          // Runs when the remote peers media stream is available.
          // We store and add it to the video containers src property.
          peer.onaddstream = function(e){
              remotestream = e.stream;
              remotevid.src = URL.createObjectURL(remotestream);
          }
          
          
          // Add the localstream to the local RTC peer so that the session has access to it.
          peer.addStream(localstream);
      }
      
      // Here, like a regular phone call, we will make a phone call.
      function call(){
          
          // Instantiate a peer 
          createPeer();
          
          // We create an offer that we will send to the remote peer.
          // This creates a session description for us to send to the remote peer
          peer.createOffer({ offerToReceiveAudio: 0, offerToReceiveVideo: 1 })
            .then(function(description){
                
                // We set it as our local session description so that our Session Description Protocol
                // has knowledge of it.
                peer.setLocalDescription(description);
                
                // We finally make the 'call' by sending out the description.
                socket.emit("callsdp", description);
            });
      }
      
      
      // Remote peer
      function reply(data){
          createPeer();
          
          // Receive peer's information and add it to Session Description. 
          peer.setRemoteDescription(new RTCSessionDescription(data))
            .then(function(){
                
                // Create an answer for the calling peer.
                peer.createAnswer({ offerToReceiveAudio: 0, offerToReciveVideo: 1 })
                    .then(function(description){
                        
                        // Set the local description.
                        peer.setLocalDescription(description);
                        
                        // Send it the calling peer
                        socket.emit("replysdp", description);
                    });
        
            });
      }
      
      // Success method to run if user accepts to media prompt
      function mediaSuccess(stream){
          localstream = stream;
          
          // Add it to the localvid container.
          localvid.src = URL.createObjectURL(localstream);
      }
      
      function mediaFailure(e){
          console.log("Media could not be retrieved.", e);
      }
      
      socket.on("joined", function(){
          console.log("Peer has joined the room");
      });
      
      // Make an offer...
      socket.on("callsdp", function(data){
          if(confirm("You have a WebRTC call. Pick?")) reply(data);
      });
      
      
      socket.on("replysdp", function(data){
          // When we receive the other peers response to the call...save the description.
          peer.setRemoteDescription(new RTCSessionDescription(data));
      });
      
      socket.on("candidate", function(data){
          // When ices are available...add them.
          peer.addIceCandidate(new RTCIceCandidate(data));
      });
      
      // Make the call
      callbtn.addEventListener("click", function(){
          call();
      });
      
      
      // We start here by grabbing a resource, in this case the webcam to share.
      navigator.mediaDevices.getUserMedia(constraints).then(mediaSuccess).catch(mediaFailure);
      
})();