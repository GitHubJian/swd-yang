<template>
  <div>
    <audio
      controls
      autoplay
    ></audio>
    <input
      @click="startRecording"
      type="button"
      value="录音"
    />
    <input
      onclick="stopRecording()"
      type="button"
      value="停止"
    />
    <input
      onclick="playRecording()"
      type="button"
      value="播放"
    />
    <input
      onclick="uploadAudio()"
      type="button"
      value="提交"
    />
    <input
      onclick="cancelAudio()"
      type="button"
      value="取消"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods:{
    
  }
};
</script>

<style>
</style>
