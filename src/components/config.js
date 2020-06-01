export const PEER_CONFIG = {
  host: 'screenshare.smash.cx',
  path: '/smash',
  key: 'JKKUJscBgLumup3p',
  secure: true,
  config: {
    'iceServers': [
      { url: 'stun:18.220.202.114:5349' },
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun1.l.google.com:19302' },
      { url: 'stun:stun2.l.google.com:19302' },
      { url: 'stun:stun3.l.google.com:19302' },
      { url: 'stun:stun4.l.google.com:19302' },
      { url: 'stun:stun.services.mozilla.com' },
      { url: 'stun:meet-jit-si-turnrelay.jitsi.net:443' },
      {
        url: 'turn:18.220.202.114:5349',
        username: 'smash',
        credential: 'hc4qjVYChz3kBRhN',
      },
      { 
        url: 'turns:18.220.202.114:443?transport=tcp',
        username: 'meet.smash.cx',
        credential: '60xNNKDk1zLZSAZi', 
      },
      { 
        url: 'turn:18.220.202.114:4446?transport=udp',
        username: 'meet.smash.cx:443',
        credential: '60xNNKDk1zLZSAZi',
      },
    ]
    // iceServers: [
    //   {
    //     'urls': 'stun:stun.l.google.com:19302'
    //   }
    //   // { urls: "stun:stun.l.google.com:19302" },
    //   // { urls: "stun:stun1.l.google.com:19302" },
    //   // { urls: "stun:stun2.l.google.com:19302" },
    //   // { urls: 'stun:voice.smash.cx:4446' },
    //   // { urls: 'stun:meet-jit-si-turnrelay.jitsi.net:443' }
    // ]
  }
}

export function log(title, ...args) {
  const fLine = `${'='.repeat(30)}[${title}]${'='.repeat(30)}`;

  console.log('\n'.repeat(1));
  console.log(fLine.toUpperCase());
  for (const arg of args) {
      console.log(arg);
  }
  console.log('='.repeat(fLine.length));
  console.log('\n'.repeat(1));
}