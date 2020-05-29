
import io from 'socket.io-client'

export default io.connect('ws.mikesantos.dev', {
  path: '/socket.io'
})