import React, { useState } from 'react';

import ScreenShare from './ScreenSharePeerJS'
import Broadcast from './Broadcast'

const PeerComponent = () => {
  const [type, setType] = useState('')

  return (
    <div style={{padding: 50, textAlign: 'center'}}> 
      {type === '' && (
        <>
          <button style={{padding: '15px 35px 15px 35px', marginRight: 15}} onClick={() => setType('screenshare-peerjs')}>ScreenShare (PeerJS)</button>
          <button style={{padding: '15px 35px 15px 35px', marginRight: 15}} onClick={() => setType('broadcaster')}>Broadcast (Cascading)</button>
        </>
      )}
      {type === 'screenshare-peerjs' && (<ScreenShare/>)}
      {type === 'broadcaster' && (<Broadcast/>)}
    </div>
  );
}

export default PeerComponent;