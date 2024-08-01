<template>
  <div class="d-flex cekbrand-header mx-auto">
    <div class="side-left bg-danger flex-fill h-100" />
    <div class="side-center p-5 flex-grow-0 flex-shrink-0 h-100 d-flex flex-column justify-content-center align-items-center">
      <div class="px-sm-3">
        <b-img
          class="mb-1"
          :src="require('@/assets/images/logo/logo.svg')"
          width="90"
        />
        <h1 class="title font-weight-bolder">
          Cek Brand
        </h1>
        <h3 class="text-danger font-weight-bolder">
          Social Media Monitoring
        </h3>
      </div>
    </div>
    <div class="side-right flex-fill h-100 d-flex">
      <div class="side-right-1 flex-fill bg-danger h-100" />
      <div class="side-right-2 flex-fill h-100" />
    </div>
  </div>
</template>

<script>
import { BImg, BLink } from 'bootstrap-vue'

export default {
  components: {
    BImg,
    BLink,
  },
}
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/variables';
.cekbrand-header {
  height: 300px;

  .title {
    color: $black;
    font-size: 42px;
    line-height: 48px;
    letter-spacing: 0px;
  }
  .side {
    &-left {
      background-image: url('~@/assets/images/home/background-product.svg');
      background-repeat: no-repeat;
      background-position: right;
      background-attachment: inherit;
    }
    &-right {
      &-1 {
        background-image: url('~@/assets/images/home/background-logo.svg');
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: inherit;
      }
      &-2 {
        background-image: url('~@/assets/images/home/background-batik.svg');
        background-repeat: no-repeat;
        background-position: right center;
        background-attachment: inherit;
        max-width: 150px;
      }
    }
  }
}
</style>
