const noop = () => {}

const defaultSetting = {
  type: 'mp3',
  bitRate: 16,
  sampleRate: 16000,
  bufferSize: 2048,
  onProcess: noop
}

export default class Recorder {
  constructor(setting) {
    this.set = Object.assign({}, defaultSetting, setting)
    this.buffer = []
    this.recSize = 0
    this.state = 0
    this.media = null
    this.process = null
  }

  static isOpen() {
    let stream = Recorder.Stream
    if (stream) {
      let tracks = stream.getTracks()
      if (tracks.length) {
        return tracks[0].readyState == 'live'
      }
    }

    return false
  }

  static isSupport() {
    let AudioContext = window.AudioContext
    if (!AudioContext) {
      AudioContext = window.webkitAudioContext
    }
    if (!AudioContext) {
      return false
    }

    let scope = window.navigator.mediaDevices || {}
    if (!scope.getUserMedia) {
      scope = window.navigator
      scope.getUserMedia ||
        (scope.getUserMedia =
          scope.webkitGetUserMedia ||
          scope.mozGetUserMedia ||
          scope.msGetUserMedia)
    }
    if (!scope.getUserMedia) {
      return false
    }

    Recorder.Scope = scope
    if (!Recorder.Ctx || Recorder.Ctx.state === 'closed') {
      Recorder.Ctx = new AudioContext()
    }

    return true
  }

  open(resolve = noop, reject = noop) {
    debugger
    if (Recorder.isOpen()) {
      resolve()
      return
    }
    if (!Recorder.isSupport()) {
      reject()
      return
    }

    let successCallback = function(stream) {
      Recorder.Stream = stream
      resolve()
    }

    let errorCallback = function(e) {
      let code = e.name || e.message || ''
      console.error(e)
      let permission = /Permission|Allow/i.test(code)
      reject(permission ? 'No Permission' : `Error Code${code}`, permission)
    }

    let pro = Recorder.Scope.getUserMedia(
      { audio: true },
      successCallback,
      errorCallback
    )

    if (pro && pro.then) {
      pro.then(successCallback)['catch'](errorCallback)
    }
  }

  start() {
    let ctx = Recorder.Ctx

    let buffer = (this.buffer = [])
    this.recSize = 0
    this._stop()
    if (!Recorder.isOpen()) {
      return
    }

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        this._start()
      })
    } else {
      this._start()
    }
  }

  _start() {
    let set = this.set,
      buffer = this.buffer

    let ctx = Recorder.Ctx
    let media = (this.media = ctx.createMediaStreamSource(Recorder.Stream))
    let process = (this.process = (
      ctx.createScriptProcessor || ctx.createJavaScriptNode
    ).call(ctx, set.bufferSize, 1, 1))

    let timer
    process.onaudioprocess = e => {
      if (this.state != 1) {
        return
      }

      let o = e.inputBuffer.getChannelData(0),
        size = o.length

      this.recSize += size

      let res = new Int16Array(size),
        power = 0

      for (var j = 0; j < size; j++) {
        var s = Math.max(-1, Math.min(1, o[j]))
        s = s < 0 ? s * 0x8000 : s * 0x7fff
        res[j] = s
        power += Math.abs(s)
      }

      buffer.push(res)

      power /= size
      let powerLv = 0
      if (power > 0) {
        powerLv = Math.round(
          Math.max(0, ((20 * Math.log10(power / 0x7fff) + 34) * 100) / 34)
        )
      }
      var bufferSampleRate = Recorder.Ctx.sampleRate
      var duration = Math.round((this.recSize / bufferSampleRate) * 1000)
      clearTimeout(timer)
      timer = setTimeout(() => {
        set.onProcess(buffer, powerLv, duration, bufferSampleRate)
      })
    }

    media.connect(process)
    process.connect(ctx.destination)
    this.state = 1
  }

  pause(_resume) {
    if (this.state) {
      this.start = _resume || 2
    }
  }

  resume() {
    this.pause(1)
  }

  close(callback = noop) {
    this._stop()
  }

  stop(successCallback = noop, errorCallback = noop) {
    let set = this.set
    if (!this.state) {
      errorCallback('未开始录音')
      return
    }
    this._stop()
    let size = this.recSize
    if (!size) {
      errorCallback('未采集到录音')
      return
    }
    let sampleRate = set.sampleRate,
      ctxSampleRate = Recorder.Ctx.sampleRate

    var step = ctxSampleRate / sampleRate
    if (step > 1) {
      size = Math.floor(size / step)
    } else {
      step = 1
      sampleRate = ctxSampleRate
      set.sampleRate = sampleRate
    }

    let res = new Int16Array(size),
      last = 0,
      idx = 0
    for (let n = 0, nl = this.buffer.length; n < nl; n++) {
      let o = this.buffer[n]
      let i = last,
        il = o.length
      while (i < il) {
        res[idx] = o[Math.round(i)]
        idx++
        i += step
      }

      last = i - il
    }

    var duration = Math.round((size / sampleRate) * 1000)

    setTimeout(() => {
      let t1 = Date.now()
      this[set.type](
        res,
        blob => {
          successCallback(blob, duration)
        },
        msg => {
          errorCallback(msg)
        }
      )
    }, 0)
  }

  _stop() {
    if (this.state) {
      this.state = 0
      this.media.disconnect()
      this.process.disconnect()
    }
  }
}

Recorder.Scope = null
Recorder.Ctx = null
