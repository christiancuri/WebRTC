import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

import { PEER_CONFIG, log } from './config'

const getDesktopScreen = () => navigator.mediaDevices.getDisplayMedia({ video: true })

function Streamer(props) {

  const [stream, setStream] = useState()
  const [roomId, setRoomId] = useState()

  useEffect(() => {
    if (stream) {
      const video = document.getElementById('video')
      video.srcObject = stream
      video.play()
    }
  }, [stream])

  const call = () => {
    const peer = new Peer(null, PEER_CONFIG)

    peer.on('open', async id => {
      log('id', id)
      setRoomId(id)

      const stream = await getDesktopScreen().catch(console.error)
      peer.call(id, stream)
      peer.on('call', (conn) => {
        log('call request', conn)
        conn.answer(stream)
      })
      setStream(stream)
    })
  }

  return (
    <div style={{borderWidth: 5, borderColor: 'red', borderStyle: 'solid', marginBottom: 50, padding: 25}}>
      <h1>Streamer</h1>
      <button  style={{padding: '15px 35px 15px 35px'}} onClick={call}>Make call</button>
      <br/>
      <br/>
      {roomId && (<h4>Your room id: <br/>{roomId}</h4>)}
      <br/>
      <video id="video" autoPlay muted style={{width: '100%'}}></video>
    </div>
  )
}

export default Streamer