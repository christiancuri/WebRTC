import React, { useState } from 'react';

import ScreenShare from './ScreenShare'


const PeerComponent = () => {
  const [type, setType] = useState('')

  return (
    <div style={{padding: 50, textAlign: 'center'}}> 
      {type === '' && (
        <>
          <button style={{padding: '15px 35px 15px 35px', marginRight: 15}} onClick={() => setType('screenshare')}>ScreenShare</button>
        </>
      )}
      {type === 'screenshare' && (<ScreenShare/>)}

    </div>
  );
}

export default PeerComponent;