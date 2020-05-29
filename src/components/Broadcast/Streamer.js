import React, { useState, useEffect, useRef, Component } from 'react';
import Peer from 'peerjs';

import io from '../../services/socket'

import { PEER_CONFIG, log } from '../config'

const getDesktopScreen = async () => navigator.mediaDevices.getDisplayMedia({ video: true })

const constraints = {
	// audio: true,
	video: {facingMode: "user"}
};

const getCamera = async () => navigator.mediaDevices.getUserMedia(constraints)

let peers = {
  current: {}
}

const customId = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);


function Streamer(props) {

  // const peers = useRef()

  const [inCall, setInCall] = useState()
  const [room, setRoom] = useState()

  const call = () => {
    getDesktopScreen().then(stream => {
      getVideo().srcObject = stream
      const id = customId()
      io.emit('broadcaster', id)
      setRoom(id)
      setInCall(true)
    })
  }

  io.on('answer', (id, desc) => {
    console.log(peers.current, desc)
    peers.current[id].setRemoteDescription({...desc})
  })

  io.on('candidate', (id, candidate) => (peers.current[id].addIceCandidate(new RTCIceCandidate(candidate))))

  io.on('bye', id => {
    peers.current[id] && peers.current[id].close();
    delete peers.current[id]
  });

  io.on('watcher', id => {
    const peerConnection = new RTCPeerConnection(PEER_CONFIG.config)
    peers.current[id] = peerConnection

    const stream = getVideo().srcObject

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))

    peerConnection
      .createOffer()
      .then(session => peerConnection.setLocalDescription(session))
      .then(() => io.emit('offer', id, peerConnection.localDescription))

    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        io.emit('candidate', id, e.candidate)
      }
    }
  })

  const getVideo = () => document.getElementById('video')


  const disconnect = () => {

  }

  return (
    <div style={{borderWidth: 5, borderColor: 'red', borderStyle: 'solid', marginBottom: 50, padding: 25}}>
      <h1>Streamer</h1>
      {!inCall ? (
        <button style={{padding: '15px 35px 15px 35px'}} onClick={call}>
          Make call
        </button>
      ) : (
        <button style={{padding: '15px 35px 15px 35px'}} onClick={disconnect}>
          Disconnect
        </button>
      )}
      <br/>
      <br/>
      {room && (<h4>Your room id: <br/>{room}</h4>)}
      <br/>
      <video id="video" autoPlay muted style={{width: '100%'}}></video>
    </div>
  )
}


export default Streamer