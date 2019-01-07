<template>
  <div class="swd-layout">
    <header class="swd-header">
      <div class="swd-nav">
        <div class="swd-nav-btn swd-nav-btn__left">
          <span class="swd-btn swd-btn-back">1</span>
        </div>
        <div class="swd-nav__title">
          {{ title }}
        </div>
        <div class="swd-nav-btn swd-nav-btn__right">
          <span class="swd-btn swd-btn-back">2</span>
        </div>
      </div>
    </header>
    <section class="swd-main">
      <slot></slot>
    </section>
    <footer class="swd-footer">
      <ul class="swd-nav swd-nav-3">
        <li class="swd-nav-item">
          <span class="swd-btn swd-btn-listen">1</span>
        </li>
        <li class="swd-nav-item">
          <span class="swd-btn swd-btn-listen">2</span>
        </li>
        <li class="swd-nav-item">
          <span class="swd-btn swd-btn-listen">3</span>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
export default {
  name: "SwdLayout",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.swd-layout {
  .swd-header {
    $navBtnWidth: 50;

    position: relative;

    .swd-nav-btn {
      position: absolute;
      top: 0;
      width: $navBtnWidth * 1px;
      text-align: center;

      &.swd-nav-btn__left {
        left: 0;
      }
      &.swd-nav-btn__right {
        right: 0;
      }
    }

    .swd-nav__title {
      padding: 0 $navBtnWidth * 1px;
    }
  }

  .swd-main {
  }

  .swd-footer {
  }
}
</style>
