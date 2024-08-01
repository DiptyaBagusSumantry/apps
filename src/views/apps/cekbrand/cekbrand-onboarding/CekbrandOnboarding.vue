<template>
  <div>
    <div id="onboarding-container" class="w-100">
      <div
        v-for="index in 4"
        :key="index"
        :class="[`position-absolute`, `background-${index}`]"
      >
        <b-img
          class="image-background"
          :src="require(`@/assets/images/pages/cekbrand/onboarding/background-${index}.svg`)" />
      </div>
      <div class="collapse-container mt-1 mx-auto">
        <div class="position-relative">
          <cekbrand-onboarding-header />
        </div>
        <div class="mt-4">
          <app-collapse
            accordion
            :type="collapseType"
          >
            <app-collapse-item
              class="collapse-icon-header"
              title=""
              v-for="(item, index) in items" :key="index"
              ref="onBoardingCollapse"
            >
              <template #header>
                <div v-html="item.title"/>
              </template>
              <component :is="item.component"/>
            </app-collapse-item>
          </app-collapse>
        </div>
        <div class="d-flex justify-content-center position-relative pb-5">
          <cekbrand-onboarding-footer />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BRow, BCol, BImg } from 'bootstrap-vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import { useWindowScroll } from '@vueuse/core'
import CekbrandOnboardingItem1 from './CekbrandOnboardingItem1.vue'
import CekbrandOnboardingItem2 from './CekbrandOnboardingItem2.vue'
import CekbrandOnboardingItem3 from './CekbrandOnboardingItem3.vue'
import CekbrandOnboardingItem4 from './CekbrandOnboardingItem4.vue'
import CekbrandOnboardingItem5 from './CekbrandOnboardingItem5.vue'
import CekbrandOnboardingHeader from './CekbrandOnboardingHeader.vue'
import CekbrandOnboardingFooter from './CekbrandOnboardingFooter.vue'

export default {
  components: {
    BRow,
    BCol,
    BImg,
    AppCollapse,
    AppCollapseItem,
    CekbrandOnboardingHeader,
    CekbrandOnboardingFooter,
    CekbrandOnboardingItem1,
    CekbrandOnboardingItem2,
    CekbrandOnboardingItem3,
    CekbrandOnboardingItem4,
    CekbrandOnboardingItem5,

  },

  data: () => ({
    collapseType: 'margin',
    items: [
      {
        title: "Langkah 1 : Buat <strong> akun Instagram bisnis </strong>",
        component: CekbrandOnboardingItem1
      },
      {
        title: "Langkah 2 : Buat <strong> Halaman Facebook </strong>",
        component: CekbrandOnboardingItem2
      },
      {
        title: "Langkah 3 : <strong> Hubungkan Instagram </strong> bisnis dengan <strong> Halaman Facebook </strong>",
        component: CekbrandOnboardingItem3
      },
      {
        title: "Langkah 4 : Hubungkan <strong> Toba.AI - CekBrand </strong> dengan <strong> Instagram bisnis </strong>",
        component: CekbrandOnboardingItem4
      },
      {
        title: "Langkah 5 : Terakhir! Sebelum mulai pakai <strong> Toba.AI - CekBrand </strong>",
        component: CekbrandOnboardingItem5
      },
    ]
  }),
  mounted() {
    if (this.$route.params.step !== undefined) {
      this.$refs.onBoardingCollapse[this.$route.params.step - 1].visible=true
    }
  },
  setup() {
    const { y } = useWindowScroll()
    return {
      y,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/variables';
$ImagePath: '~@/assets/images/pages/cekbrand/onboarding/';
$IconPath: '~@/assets/images/icons/';

#onboarding-container {
  position: absolute;
  overflow: hidden;
  min-width: 500px;
  .background-1 {
    margin-top: 185px;
  }
  .background-2 {
    margin-top: 1250px;
    width: inherit;
  }
  .background-3 {
    margin-top: 2700px;
    right: 0px;
  }
  .background-4 {
    margin-top: 3700px;
    width: inherit;
  }
  .image-background {
    width: inherit;
  }
  .collapse-container {
    width: 82%;
    strong {
    -webkit-text-stroke-width: 0.4px;
    }
    .title {
      -webkit-text-stroke-width: 1px;
      font-size: 36px
    }
    .card {
      background-color: transparent;
      box-shadow: none !important;
      &-header {
        background-color: white;
        height: 88px;
        color: #368AC8;
        border-radius: 8px;
        font-size: 18px;
        box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.08);
        .lead {
          font-size: 18px;
          font-weight: 500;
        }
      }
      .sub-title {
        color: $black !important;
        -webkit-text-stroke-width: 1.3px;
      }
      .collapse {
        background-color: transparent;
        color: $black;
        .card-header {
          background-color: transparent;
          box-shadow: none;
        }
      }
    }
    .collapse-item {
      .embed-responsive {
        margin-top: 20px;
        width: 75%;
      }
      .m-block {
        margin-block: 10px;
      }
      .lead {
        color: $black;
      }
    }
    .collapse-icon {
      &-header [aria-expanded="false"]::after  {
        background-image: url(#{$IconPath}plus-circle.svg);
        margin-top: -19px;
        background-size: 24px;
        width: 24px;
        height: 24px;
      }
      &-header [aria-expanded="true"]::after  {
        background-image: url(#{$IconPath}minus-circle.svg);
        margin-top: -19px;
        background-size: 24px;
        width: 24px;
        height: 24px;
      }
      &-sub [aria-expanded="false"]::after  {
        background-image: url(#{$IconPath}small-arrow-up.svg);
        margin-top: -19px;
        background-size: 24px;
        width: 24px;
        height: 24px;
      }
      &-sub [aria-expanded="true"]::after  {
        background-image: url(#{$IconPath}small-arrow-up.svg);
        margin-top: -19px;
        background-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
    .btn {
      &-gradient {
        &-primary {
          &:hover {
            background: linear-gradient(
              279.9deg,
              #f5317f 0%,
              rgba(245, 49, 127, 0) 100%
              ),
            #ff7c6e !important;
          }
        }
      }
    }
  }
  @media only screen and (max-width: 1000px) {
    .mt-lg-4 {
      margin-top: 50px;
    }
  }
}
</style>
