import React, { useState, useEffect, useCallback } from 'react';

import { PEER_CONFIG } from '../config'

import io from '../../services/socket'

let peerConnection

const getVideo = () => document.getElementById('video')

function Receiver(props) {

  const [room, setRoom] = useState()
  const [loading, setLoading] = useState(false)
  const [inCall, setInCall] = useState(false)
  const [disabled, setDisabled] = useState(false)


  const handleInput = (e) => setRoom(e.target.value.trim())

  const handleJoin = useCallback(() => {
    io.emit('watcher', room);
    setLoading(true)
    setInCall(true)
    setDisabled(true)
  })

  const disconnect = () => {
    peerConnection && peerConnection.close()
    peerConnection = undefined
    setLoading(false)
    setInCall(false)
    const video = getVideo()
    video.srcObject.getVideoTracks().forEach(track => {
      track.stop()
      video.srcObject.removeTrack(track);
    });
    video.pause();
    video.removeAttribute('src');
    video.load();
  }

  useEffect(() => {
    io.on('offer', (id, desc) => {
      peerConnection = new RTCPeerConnection(PEER_CONFIG.config);
      peerConnection.setRemoteDescription(desc)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => io.emit('answer', id, peerConnection.localDescription));

      peerConnection.onaddstream = (e) => {
        getVideo().srcObject = e.stream;
        setLoading(false)
        setDisabled(false)
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

    io.on('bye', () => peerConnection.close());

    return () => {
      [
        'offer',
        'candidate',
        'broadcaster',
        'bye',
      ].forEach(fn => io.off(fn))
    }
  }, [])
  

  return (
    <div style={{borderWidth: 5, borderColor: 'green', borderStyle: 'solid', padding: 25}}>
      <h1>Viewer</h1>

      {!inCall ? (
        <div>
          Room to join: 
          {' '}
          <input style={{width: 450}} onChange={handleInput}/>
          {' '}
          <button style={{padding: '5px 15px 5px 15px'}} onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <button style={{padding: '15px 35px 15px 35px'}} onClick={disconnect} disabled={disabled}>
          Disconnect
        </button>
      )}
      <br/>
      <br/>
      {loading && (<h3>Loading...</h3>)}
      <video id="video" autoPlay muted style={{width: '100%'}}></video>
    </div>
  )
}

export default Receiver