import React, { useState, useEffect } from 'react';
import Streamer from './Streamer'
import Viewer from './Viewer'


const PeerComponent = () => {
  const [type, setType] = useState('')

  return (
    <div style={{padding: 50, textAlign: 'center'}}> 
      {type === '' && (
        <>
          <button style={{padding: '15px 35px 15px 35px', marginRight: 15}} onClick={() => setType('streamer')}>I am streamer</button>

          <button style={{padding: '15px 35px 15px 35px', marginLeft: 15}} onClick={() => setType('viewer')}>I am viewer</button>
        </>
      )}
      {type === 'streamer' && (<Streamer/>)}
      {type === 'viewer' && (<Viewer/>)}

    </div>
  );
}

export default PeerComponent;