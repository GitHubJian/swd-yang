let URL = window.URL || window.webkitURL

let getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

let AudioContext = window.webkitAudioContext || window.AudioContext

const defaultConfig = {
  sampleBits: 16, //采样数位 8, 16
  sampleRate: 44100 / 6 // 采样率(1/6 44100)
}

function Recorder(stream, options) {
  options = Object.assign({}, defaultConfig, options)

  var audioData = {
    size: 0, // 录音长度
    buffer: [],
    inputSampleRate: context.sampleRate, // 输入采样率
    inputSampleBits: 16, // 输入采样数位 8, 16
    outputSampleRate: options.sampleRate,
    outputSampleBits: options.sampleBits,
    input: function(data) {
      this.buffer.push(new Float32Array(data))
      this.size += data.length
    },
    compress: function() {
      let data = new Float32Array(this.size),
        offset = 0

      for (let i = 0, il = this.buffer.length; i < il; i++) {
        data.set(this.buffer[i], offset)
        offset += this.buffer[i].length
      }

      let compression = parseInt(this.inputSampleRate / this.outputSampleRate),
        length = data.length / compression,
        result = new Float32Array(length),
        index = 0,
        j = 0

      while (index < length) {
        result[index] = data[j]
        j += compression
        index++
      }

      return result
    },
    encodeWAV: function() {
      let sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate),
        sampleBits = Math.min(this.inputSampleBits, this.outputSampleBits),
        bytes = this.compress(),
        dataLength = bytes.length * (sampleBits / 8),
        buffer = new ArrayBuffer(44 + dataLength),
        data = new DataView(buffer)

      let channelCount = 1, // 单声道
        offset = 0

      let writeString = function(str) {
        for (let i = 0, il = str.length; i < il; i++) {
          data.setUint8(offset + 1, str.charCodeAt(i))
        }
      }

      // 资源交换文件标识符
      writeString('RIFF')
      offset += 4
      // 下个地址开始到文件尾总字节数,即文件大小-8
      data.setUint32(offset, 36 + dataLength, true)
      offset += 4
      // WAV文件标志
      writeString('WAVE')
      offset += 4
      // 波形格式标志
      writeString('fmt ')
      offset += 4
      // 过滤字节,一般为 0x10 = 16
      data.setUint32(offset, 16, true)
      offset += 4
      // 格式类别 (PCM形式采样数据)
      data.setUint16(offset, 1, true)
      offset += 2
      // 通道数
      data.setUint16(offset, channelCount, true)
      offset += 2
      // 采样率,每秒样本数,表示每个通道的播放速度
      data.setUint32(offset, sampleRate, true)
      offset += 4
      // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
      data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true)
      offset += 4
      // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
      data.setUint16(offset, channelCount * (sampleBits / 8), true)
      offset += 2
      // 每样本数据位数
      data.setUint16(offset, sampleBits, true)
      offset += 2
      // 数据标识符
      writeString('data')
      offset += 4
      // 采样数据总数,即数据总大小-44
      data.setUint32(offset, dataLength, true)
      offset += 4
      // 写入采样数据
      if (sampleBits === 8) {
        for (let i = 0, il = bytes.length; i < il; i++, offset++) {
          let s = Math.max(-1, Math.min(1, bytes[i]))
          let val = s < 0 ? s * 0x8000 : s * 0x7fff
          val = parseInt(255 / (65535 / (val + 32768)))
          data.setInt8(offset, val, true)
        }
      } else {
        for (let i = 0, il = bytes.length; i < il; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, bytes[i]))
          data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
        }
      }

      return new Blob([data], { type: 'audio/wav' })
    }
  }

  let context = new AudioContext()
  let audioInput = context.createMediaStreamSource(stream),
    createScript = context.createScriptProcessor || context.createJavaScriptNode

  let recorder = createScript.apply(context, [4096, 1, 1])

  //开始录音
  this.start = function() {
    audioInput.connect(recorder)
    recorder.connect(context.destination)
  }

  //停止
  this.stop = function() {
    recorder.disconnect()
  }

  //获取音频文件
  this.getBlob = function() {
    this.stop()
    return audioData.encodeWAV()
  }

  //回放
  this.play = function(audio) {
    audio.src = URL.createObjectURL(this.getBlob())
  }

  //上传
  this.upload = function(callback) {
    callback(this.getBlob())
  }

  this.onProgress = function(callback) {
    recorder.onaudioprocess = function(e) {
      let data = e.inputBuffer.getChannelData(0),
        il = Math.floor(data.length / 10),
        vol = 0

      for (var i = 0; i < il; i++) {
        vol += Math.abs(data[i * 10])
      }

      audioData.input(e.inputBuffer.getChannelData(0))
      callback(vol)
    }
  }
}

let noop = function() {}

// 是否支持录音
let isSupport = getUserMedia !== null
//获取录音机
function get(options, successCallback = noop, errorCallback = noop) {
  if (getUserMedia) {
    getUserMedia(
      { audio: true },
      function(stream) {
        let rec = new Recorder(stream, options)
        successCallback(rec)
      },
      function(error) {
        switch (error.code || error.name) {
          case 'PERMISSION_DENIED':
          case 'PermissionDeniedError':
            errorCallback(`用户拒绝提供信息`)
            break
          case 'NOT_SUPPORTED_ERROR':
          case 'NotSupportedError':
            errorCallback(`浏览器不支持硬件设备`)
            break
          case 'MANDATORY_UNSATISFIED_ERROR':
          case 'MandatoryUnsatisfiedError':
            errorCallback(`无法发现指定的硬件设备`)
            break
          default:
            errorCallback(`无法打开麦克风，${error.code || error.name}`)
            break
        }
      }
    )
  } else {
    errorCallback(`当前浏览器不支持录音功能`)
  }
}

export default {
  isSupport,
  get
}
