<template>
  <SwdLayout title="Swd Test">
    <div
      class="swd-content"
      slot
    >
      <!-- <SwdVideo
        poster="http://img01.sogoucdn.com/app/a/100540018/adce2e5f62308da83366f5649eb448d1"
        source="http://sofa.resource.shida.sogoucdn.com/f8655ed0-e9ee-4d49-a718-1c478f0397f32_1_0.mp4"
      ></SwdVideo> -->
      <div class="swd-poem__wrapper">
        <h1 class="swd-poem-title">
          赠别
        </h1>
        <p class="swd-poem-poet">
          <span class="swd-poet-dynasty">
            唐代
          </span>
          <span class="swd-poet-name">
            杜牧
          </span>
        </p>
        <audio controls>
          Your browser does not support the <code>audio</code> element.
          <source
            id="recorder"
            type="audio/mp3"
          >
        </audio>
        <!-- <div
          style="background:red;width:100px;height:100px"
          @click="onRecorderClickHandle"
        >
          录音
        </div> -->

        <div style="background:red;width:100px;height:100px"></div>
        <div>
          <span class="item" style="background:blue;display:inline-block;width:35px;height:35px">1</span>
        </div>
      </div>
    </div>
  </SwdLayout>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // this.video();
    // this.audio();
  },
  methods: {
    onRecorderClickHandle() {
      let rec = new this.$mp3();
      rec.open(
        () => {
          debugger;
          rec.start();
          setTimeout(() => {
            rec.stop(
              (blob, duration) => {
                var audio = document.querySelector("audio");
                audio.src = URL.createObjectURL(blob);

                console.log(
                  URL.createObjectURL(blob),
                  `Duration: ${duration}ms`
                );
                rec.close();
              },
              msg => {
                console.error(`录音失败: ${msg}`);
              }
            );
          }, 3e3);
        },
        msg => {
          console.warn(`无法录音: ${msg}`);
        }
      );
    }
  }
};
</script>

<style>
</style>
