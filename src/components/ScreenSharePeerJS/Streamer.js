import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

import { PEER_CONFIG, log } from '../config'

const getDesktopScreen = () => navigator.mediaDevices.getDisplayMedia({ video: true })

function Streamer(props) {

  const [stream, setStream] = useState()
  const [roomId, setRoomId] = useState()

  const [conns, setConns] = useState([])

  const peer = useRef()

  useEffect(() => {
    if (stream) {
      const video = document.getElementById('video')
      video.srcObject = stream
      video.play()
    }
  }, [stream])

  const call = () => {
    peer.current = new Peer(null, PEER_CONFIG)

    peer.current.on('open', async id => {
      log('id', id)
      setRoomId(id)

      const stream = await getDesktopScreen().catch(console.error)
      log('stream', stream)
      setStream(stream)
      stream.oninactive = () => disconnect()

      peer.current.call(id, stream)
      
      peer.current.on('call', (conn) => {
        log('call request', conn)
        conn.answer(stream)
        conn.on('close', () => setConns([...conns.filter(item => item.connectionId !== conn.connectionId)]))
        setConns([...conns, conn])
      })
    })
    peer.current.on('disconnected', id => {
      log('disconnect', id)
    })
  }

  const disconnect = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    if (conns && conns.length) {
      conns.forEach(conn => conn.close())
      setConns([])
    }
    if (peer.current) {
      peer.current.disconnect() 
      peer.current.destroy()
    }
    setRoomId(undefined)
    peer.current = undefined
  }

  return (
    <div style={{borderWidth: 5, borderColor: 'red', borderStyle: 'solid', marginBottom: 50, padding: 25}}>
      <h1>Streamer</h1>
      {!peer.current ? (
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
      {roomId && (<h4>Your room id: <br/>{roomId}</h4>)}
      <br/>
      <video id="video" autoPlay muted style={{width: '100%'}}></video>
    </div>
  )
}

export default Streamer