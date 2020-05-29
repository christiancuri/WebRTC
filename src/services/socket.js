
import io from 'socket.io-client'

export default io.connect('wss://ws.mikesantos.dev', {
  path: '/socket.io'
})