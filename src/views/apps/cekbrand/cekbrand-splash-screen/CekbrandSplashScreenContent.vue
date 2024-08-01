<template>
  <div
    class="content-splash-screen d-flex justify-xl-content-around flex-wrap flex-xl-nowrap align-items-start"
    :class="item.category !== 'statistic' ? 'flex-row' : 'flex-row-reverse'"
  >
    <div :class="`description-${item.category} mr-auto`">
      <h4 class="text-black">Fitur</h4>
      <h2 class="font-weight-bolder">{{ item.name }}</h2>
      <div v-html="item.description"></div>
      <b-button
        @click="$emit('hideModal')"
        v-show="item.category === 'post'"
        class="btn-enter mt-2 d-flex align-items-center"
      >
        <span class="mr-25 font-weight-bolder">Masuk</span>
        <feather-icon
          v-for="(item, index) in metaSvg" :key="index"
          icon="ChevronRightIcon"
          size="16"
          stroke-width="3px"
          :width="item.width"
          :viewBox="item.viewBox"
          :class="`transparent-color-${index+1}`"
        />
      </b-button>
    </div>
    <b-img
      :class="`img-content-${item.category}`"
      style="z-index:200"
      fluid
      :src="require(`@/assets/images/pages/cekbrand/splash-screen/cekbrand-${item.category}.png`)"
    />
  </div>
</template>

<script>
import { BImg, BButton, BCard, BModal } from 'bootstrap-vue'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      metaSvg: [
        {viewBox: "8 0 5 24", width: "12px"},
        {viewBox: "12 0 2 24", width: "10px"},
        {viewBox: "14 0 12 24", width:"16px"},
      ],
    }
  },
  components: {
    BImg,
    BCard,
    BModal,
    BButton,
  },
}
</script>
<style lang="scss">
@import '@core/scss/base/bootstrap-extended/include';
.content-splash-screen {
  margin-top: 90px;
  h2,
  h5 {
    color: #283138 !important;
  }
  h5 {
    line-height: 150%;
  }
  & > div[class*="description-"] {
    @include media-breakpoint-down(md) {
      padding: 0 20px;
    }
  }
  .description {
    &-competitor {
      padding: 120px 0 0 70px;
    }
    &-statistic {
      padding: 60px 50px 0 40px;
    }
    &-post {
      padding: 50px 0 0 70px;
    }
  }
  .img-content {
    &-competitor,
    &-post {
      padding: 0 40px 0 0;
      @include media-breakpoint-down(md) {
        padding: 0 10px;
      }
    }
    &-statistic {
      padding: 0 0 0 40px;
      @include media-breakpoint-down(md) {
        padding: 0 10px;
      }
    }
  }
  .btn-enter {
    background: linear-gradient(279.9deg, rgba(245, 49, 127, 0) 0%, #F5317F 100%), #FF7C6E !important;
    border-radius: 20px;
    border-color: transparent !important;
  }
}
</style>
