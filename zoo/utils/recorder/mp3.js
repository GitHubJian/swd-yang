import Core from './core.js'
import Lamejs from 'lamejs'

export default class Mp3 extends Core {
  constructor() {
    super()

    this.enc_mp3 = {
      stable: true,
      testmsg:
        '采样率范围48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000'
    }
  }

  mp3(res, successCallback, errorCallback) {
    let set = this.set,
      size = res.length
    let mp3 = new Lamejs.Mp3Encoder(1, set.sampleRate, set.bitRate)
    let blockSize = 5670,
      data = [],
      idx = 0

    let run = () => {
      if (idx < size) {
        let buf = mp3.encodeBuffer(res.subarray(idx, idx + blockSize))
        if (buf.length > 0) {
          data.push(buf)
        }
        idx += blockSize
        setTimeout(run)
      } else {
        let buf = mp3.flush()
        if (buf.length) {
          data.push(buf)
        }

        successCallback(new Blob(data, { type: 'audio/mp3' }))
      }
    }

    run()
  }
}
