import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

import { PEER_CONFIG, log } from '../config'

const getCanvasStream = () => document.createElement('canvas').captureStream(25)

function Receiver(props) {

  const [room, setRoom] = useState()
  const [stream, setStream] = useState()

  const peer = useRef()

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
    peer.current = new Peer(null, PEER_CONFIG)
    peer.current.on('open', async id => {
      log('id join', id)
      log('room', room)
      log('peer', peer.current)
      peer.current.on('error', e => log('error', e))

      const call = peer.current.call(room, getCanvasStream())
      log('call', call)
      call.on('stream', stream => {
        log('stream', stream)
        setStream(stream)
      })

      call.on('close', () => {
        log('close')
        setStream(undefined)
        disconnect()
      })
      call.on('error', b => {
        log('error call', b)
      })
    })
  }

  const disconnect = () => {
    if (peer.current) {
      peer.current.disconnect()
      peer.current.destroy()
    }
    peer.current = undefined
  }

  return (
    <div style={{borderWidth: 5, borderColor: 'green', borderStyle: 'solid', padding: 25}}>
      <h1>Viewer</h1>

      {!peer.current ? (
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