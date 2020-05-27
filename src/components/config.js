export const PEER_CONFIG = {
  host: '35.194.15.225',
  port: 9001,
  path: '/',
  key: 'peer'
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