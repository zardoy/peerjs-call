import Peerjs, { DataConnection, MediaConnection } from 'peerjs'
import * as qr from 'qrcode'

function addCanvas(name, contents) {
    const span = document.createElement('span')
    span.innerText = name
    document.body.appendChild(span)
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    document.body.appendChild(canvas)
    qr.toCanvas(canvas, contents)
}

const peer = new Peerjs({
    debug: 3,
    config: {
        'iceServers': [
            { url: 'stun:stun01.sipphone.com' },
            { url: 'stun:stun.ekiga.net' },
            { url: 'stun:stunserver.org' },
            { url: 'stun:stun.softjoys.com' },
            { url: 'stun:stun.voiparound.com' },
            { url: 'stun:stun.voipbuster.com' },
            { url: 'stun:stun.voipstunt.com' },
            { url: 'stun:stun.voxgratia.org' },
            { url: 'stun:stun.xten.com' },
            {
                url: 'turn:192.158.29.39:3478?transport=udp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
            },
            {
                url: 'turn:192.158.29.39:3478?transport=tcp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
            }
        ]
    }
})

let qs = new URLSearchParams(location.search)

let peerId = qs.get('peer') || prompt('Enter peer id or empty string if host:')

if (peerId === null) {
    // exit early
    throw new Error('peerId is null')
}

qs.set('peer', peerId)

history.replaceState(null, '', '?' + qs.toString())

if (peerId === '') {

    let currentCall: MediaConnection | undefined
    peer.on('call', (call) => {
        if (currentCall) return
        currentCall = call
        console.log('call receive')
        call.answer()
        call.on('stream', (stream) => {
            const video = document.createElement('video')
            video.srcObject = stream
            video.controls = true
            video.muted = true
            document.body.appendChild(video)
            video.play()
        })
        call.on('close', () => {
            currentCall = undefined
        })
    })

    peer.on('open', (id) => {
        console.log('open', id)
        addCanvas('url', `${location.origin}?peer=${id}`)
        addCanvas(`id (${id})`, `${id}`)
    })
} else if (peerId) {
    const fullHdConstraints = {
        video: { width: { exact: 1920 }, height: { exact: 1080 } }
    };
    const hdConstraints = {
        video: { width: { exact: 1280 }, height: { exact: 720 } },
        frameRate: 60,
    }

    navigator.getUserMedia({
        video: {
            // back phone camera
            facingMode: 'environment',
            // ...fullHdConstraints,
            ...hdConstraints,
            // auto exposure
            autoGainControl: {
                exact: true,
            },
        },
        // audio: true
    }, (stream) => {
        const call = peer.call(peerId!, stream)

        call.on('iceStateChanged', console.warn)
        console.log(call)
        call.on('close', () => {
            const reconnect = confirm('Finished. Reconnect?')
            if (reconnect) {
                location.reload()
            }
        })
    }, (err) => {
        console.error(err)
        const span = document.createElement('span')
        span.innerText = err.message!
        document.body.appendChild(span)
    })

    const resetButton = document.createElement('button')
    resetButton.innerText = 'Reset'
    resetButton.onclick = () => {
        location.search = ''
    }
    document.body.appendChild(resetButton)
}
