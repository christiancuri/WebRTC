import React, { useState, useEffect, useRef } from 'react';

import { PEER_CONFIG, log } from '../config'

import io from '../../services/socket'

let peerConnection

function Receiver(props) {

  const [room, setRoom] = useState()

  // const peer = useRef()

  const getVideo = () => document.getElementById('video')

  io.on('offer', (id, desc) => {
    peerConnection = new RTCPeerConnection(PEER_CONFIG.config);
    peerConnection.setRemoteDescription(desc)
      .then(() => peerConnection.createAnswer())
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => io.emit('answer', id, peerConnection.localDescription));

    peerConnection.ontrack = (e) => {
      getVideo().srcObject = e.streams[0];
    };
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        io.emit('candidate', id, e.candidate);
      }
    };
  })

  io.on('candidate', (_, candidate) => 
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      .catch(console.error)
  );

  io.on('broadcaster', () => io.emit('watcher'));
  
  io.on('bye', () => peerConnection.close());

  const handleInput = (e) => setRoom(e.target.value.trim())

  const handleJoin = () => {
    io.emit('watcher', room);
  }

  const disconnect = () => {

  }
  

  return (
    <div style={{borderWidth: 5, borderColor: 'green', borderStyle: 'solid', padding: 25}}>
      <h1>Viewer</h1>

      {!peerConnection ? (
        <div>
          Room to join: 
          {' '}
          <input style={{width: 450}} onChange={handleInput}/>
          {' '}
          <button style={{padding: '5px 15px 5px 15px'}} onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <button style={{padding: '15px 35px 15px 35px'}} onClick={disconnect}>
          Disconnect
        </button>
      )}
      <br/>
      <br/>
      <video id="video" autoPlay muted style={{width: '100%'}}></video>
    </div>
  )
}

export default Receiver