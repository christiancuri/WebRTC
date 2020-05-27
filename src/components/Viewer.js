import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

import { PEER_CONFIG, log } from './config'

const getCanvasStream = () => document.createElement('canvas').captureStream(25)

function Receiver(props) {

  const [room, setRoom] = useState()
  const [stream, setStream] = useState()

  useEffect(() => {
    if (stream) {
      const video = document.getElementById('video')
      video.srcObject = stream
      video.play()
    }
  }, [stream])

  const handleInput = (e) => setRoom(e.target.value.trim()) 

  const handleJoin = () => {
    if (!room) return alert('Missing room')
    const peer = new Peer(null, PEER_CONFIG)
    peer.on('open', async id => {
      log('id join', id)
      log('room', room)
      log('peer', peer)
      peer.on('error', e => log('error', e))

      const call = peer.call(room, getCanvasStream())
      log('call', call)
      call.on('stream', stream2 => {
        log('stream', stream2)
        setStream(stream2)
      })
    })
  }

  return (
    <div style={{borderWidth: 5, borderColor: 'green', borderStyle: 'solid', padding: 25}}>
      <h1>Viewer</h1>

      Room to join: 
      <input style={{width: 450}} onChange={handleInput}/>
      {' '}
      <button style={{padding: '5px 15px 5px 15px'}} onClick={handleJoin}>Join</button>
      <br/>
      <br/>
      <video id="video" autoPlay muted style={{width: '100%'}}></video>
    </div>
  )
}

export default Receiver