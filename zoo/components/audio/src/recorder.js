const defaultOptions = {
  sampleBits: 8,
  sampleRate: 44100 / 6
}

class Recorder {
  constructor(stream, opts = defaultOptions) {
    let AudioContext = window.AudioContext || window.webkitAudioContext
    let ctx = new AudioContext()
    let audioInput = ctx.createMediaStreamSource(stream)
    let recorder = ctx.createScriptProcessor(4096, 1, 1)

    let audioData = {
      size: 0,
      buffer: [],
      inputSampleRate: opts.sampleRate,
      inputSampleBits: 16,
      outputSampleRate: opts.sampleRate,
      outputSampleBits: opts.sampleBits,
      input: function(data) {
        this.buffer.push(new Float32Array(data))
        this.size += data.length
      },
      compress: function() {
        let data = new Float32Array(this.size)
        let offset = 0
        for (let i = 0, il = this.buffer.length; i < il; i++) {
          data.set(this.buffer[i], offset)
          offset += this.buffer[i].length
        }

        let compression = parseInt(this.inputSampleRate / this.outputSampleRate)
        let length = data.length / compression
        let result = new Float32Array(length)
        var index = 0,
          j = 0
        while (index < length) {
          result[index] = data[j]
          j += compression
          index++
        }

        return result
      }
    }
  }
}
