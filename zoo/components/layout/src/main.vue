<template>
  <div class="swd-layout swd-layout-header__fixed swd-layout-footer__fixed">
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
html,
body {
  height: 100%;
}

.swd-layout {
  height: 100%;
  &.swd-layout-header__fixed {
    $headerFixedHeight: 50;
    padding-top: $headerFixedHeight * 1px;

    .swd-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: $headerFixedHeight * 1px;
    }
  }

  &.swd-layout-footer__fixed {
    $footerFixedHeight: 50;
    padding-bottom: $footerFixedHeight * 1px;

    .swd-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: $footerFixedHeight * 1px;
    }
  }

  .swd-header {
    $navBtnWidth: 50;

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
    position: relative;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
