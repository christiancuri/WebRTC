import React, { useState, useEffect } from 'react';

import io from '../../services/socket'

import { PEER_CONFIG } from '../config'

const getDesktopScreen = async () => navigator.mediaDevices.getDisplayMedia({ video: {
  // width: {
  //   ideal: 1280,
  //   max: 1280,
  // },
  // height: {
  //   ideal: 720,
  //   max: 720,
  // },
  aspectRatio: 1.7777777777777777,
  resizeMode: 'crop-and-scale',
  displaySurface: 'monitor',
  logicalSurface: true,
  width: {
    ideal: 1920,
    max: 1920,
  },
  height: {
    ideal: 1080,
    max: 1080,
  },
  frameRate: 5,
  cursor: 'always'
} })

const constraints = {
	// audio: true,
	video: {facingMode: "user"}
}; 

const getCamera = async () => navigator.mediaDevices.getUserMedia(constraints)

let peers = {}

const customId = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);

const getVideo = () => document.getElementById('video')

function Streamer(props) {

  const [inCall, setInCall] = useState()
  const [room, setRoom] = useState()
  const [total, setTotal] = useState(0)

  const call = () => {
    getDesktopScreen().then(stream => {
      getVideo().srcObject = stream
      getVideo().srcObject.oninactive = () => disconnect()
      const id = customId()
      io.emit('broadcaster', id)
      setRoom(id)
      setInCall(true)
    })
  }

  useEffect(() => {
    console.log('montou')
    io.on('answer', (id, desc) => {
      peers[id].setRemoteDescription({...desc})
    })


    io.on('watcher', id => {
      setTotal(total + 1)
      const peerConnection = new RTCPeerConnection(PEER_CONFIG.config)
      peers[id] = peerConnection

      peerConnection.addStream(getVideo().srcObject)

      peerConnection
        .createOffer()
        .then(session => peerConnection.setLocalDescription(new RTCSessionDescription(session)))
        .then(() => io.emit('offer', id, peerConnection.localDescription))

      peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
          io.emit('candidate', id, e.candidate)
        }
      }
    })

    io.on('candidate', (id, candidate) => (peers[id].addIceCandidate(new RTCIceCandidate(candidate))))

    io.on('bye', id => {
      setTotal(total - 1)
      peers[id] && peers[id].close();
      delete peers[id]
    });

    return () => {
      [
        'answer',
        'watcher',
        'candidate',
        'bye',
      ].forEach(fn => io.off(fn))
    }
  })

  const disconnect = () => {
    console.log('disconnect')
    for(const key of Object.keys(peers)) {
      if (peers[key]) {
        try {
          peers[key].close()
          delete peers[key]
        } catch (error) {}
      }
    }
    setInCall(false)
    setRoom('')
    setTotal(0)
    const video = getVideo()
    video.srcObject.getVideoTracks().forEach(track => {
      track.stop()
      video.srcObject.removeTrack(track);
    });
    video.pause();
    video.removeAttribute('src');
    video.load();
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
      <br/>
      {total && (<h4>Total in room: <br/>{total}</h4>)}
      <br/>
      <video id="video" autoPlay muted style={{width: '100%'}}></video>
    </div>
  )
}


export default Streamer