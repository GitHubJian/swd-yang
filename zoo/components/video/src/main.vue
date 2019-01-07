<template>
  <div class="ls-panel">
    <div class="ls-wrapper ls-video-wrapper">
      <video
        class="video-js"
        controls=""
        preload="auto"
        width="100%"
        x-webkit-airplay="true"
        webkit-playsinline="true"
        playsinline="true"
        :poster="poster"
        data-setup="{}"
      >
        <source
          :src="source"
          type="video/mp4"
        >
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider
          upgrading to a web browser that
          <a
            href="http://videojs.com/html5-video-support/"
            target="_blank"
          >supports HTML5 video</a>
        </p>
      </video>
    </div>
  </div>
</template>

<script>
export default {
  name: "SwdVideo",
  props: {
    poster: {
      type: String,
      default: ""
    },
    source: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>

