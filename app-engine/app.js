const { createServer } = require('http')
const WebSocketServer = require('ws').Server
const child_process = require('child_process')
const url = require('url')

const port = parseInt(process.env.PORT, 10) || 8001

const server = createServer().listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on port ${port}`)
})

const wss = new WebSocketServer({
  server: server,
})

wss.on('connection', (ws, req) => {
  console.log('Streaming socket connected')
  ws.send('WELL HELLO THERE FRIEND')

  const queryString = url.parse(req.url).search
  const params = new URLSearchParams(queryString)
  const key = params.get('key')

  const rtmpUrl = `rtmp://global-live.mux.com:5222/app/${key}`

  const ffmpeg = child_process.spawn('ffmpeg', [
    '-loop',
    '1',
    '-i',
    './placeholder.png',
    '-i',
    '-',

    // video codec config: low latency, adaptive bitrate
    '-c:v',
    'libx264',
    '-tune',
    'stillimage',

    // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
    '-c:a',
    'aac',
    '-ar',
    '44100',
    '-b:a',
    '64k',

    //force to overwrite
    '-y',

    // used for audio sync
    '-use_wallclock_as_timestamps',
    '1',
    '-async',
    '1',

    //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
    //'-strict', 'experimental',
    '-bufsize',
    '1000',
    '-f',
    'flv',

    rtmpUrl,
  ])
  // Kill the WebSocket connection if ffmpeg dies.
  ffmpeg.on('close', (code, signal) => {
    console.log(
      'FFmpeg child process closed, code ' + code + ', signal ' + signal
    )
    ws.terminate()
  })

  // Handle STDIN pipe errors by logging to the console.
  // These errors most commonly occur when FFmpeg closes and there is still
  // data to write.f If left unhandled, the server will crash.
  ffmpeg.stdin.on('error', (e) => {
    console.log('FFmpeg STDIN Error', e)
  })

  // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
  ffmpeg.stderr.on('data', (data) => {
    ws.send('ffmpeg got some data')
    console.log('FFmpeg STDERR:', data.toString())
  })

  ws.on('message', (msg) => {
    if (Buffer.isBuffer(msg)) {
      console.log('this is some video data')
      ffmpeg.stdin.write(msg)
    } else {
      console.log(msg)
    }
  })

  ws.on('close', (e) => {
    console.log('shit got closed, yo')
    ffmpeg.kill('SIGINT')
  })
})
