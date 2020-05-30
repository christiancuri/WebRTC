export const PEER_CONFIG = {
  host: 'screenshare.smash.cx',
  path: '/smash',
  key: 'JKKUJscBgLumup3p',
  secure: true,
  config: {
    'iceServers': [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: 'stun:meet-jit-si-turnrelay.jitsi.net:443' }
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