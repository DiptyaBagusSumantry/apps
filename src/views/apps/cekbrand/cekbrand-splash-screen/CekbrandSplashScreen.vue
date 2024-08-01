<template>
  <b-modal
    ref="refSplashScreenModal"
    id="splash-screen-modal"
    class="mx-auto"
    size="xl"
    hide-footer
    centered
  >
    <swiper
      class="swiper-splash-screen swiper-navigations"
      :options="swiperOptions"
      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
    >
      <swiper-slide  v-for="(item, index) in splashScreenItems" :key="index">
        <div :class="`bg-image-${item.category}`">
          <div class="d-flex justify-content-end">
            <b-button
              variant="flat-pink"
              class="btn-skip d-flex align-items-center"
              @click="hideModal"
            >
              <span class="font-weight-bolder">Lewati</span>
              <feather-icon
                v-for="index in 3" :key="index"
                icon="ChevronRightIcon"
                size="16"
                stroke-width="3px"
                :class="`transparent-color-${index--}`"
              />
            </b-button>
          </div>
          <div class="d-flex flex-wrap justify-content-center align-items-center">
            <h2 class="pt-1 pr-1">Selamat Datang di</h2>
            <b-img
              :src="require('@/assets/images/logo/toba-logo.svg')"
              width="171px"
            />
          </div>
          <cekbrand-splash-screen-content
            :item="item"
            @hideModal="hideModal"
          />
        </div>
      </swiper-slide>

      <!-- Add Arrows -->
      <div
        slot="button-next"
        class="swiper-button-next"
      />
      <div
        slot="button-prev"
        class="swiper-button-prev"
      />
      <div
        slot="pagination"
        class="swiper-pagination"
      />
    </swiper>
  </b-modal>
</template>
<script>
// import 'swiper/css/swiper.css'
import 'swiper/swiper-bundle.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { BImg, BButton, BModal } from 'bootstrap-vue'
// eslint-disable-next-line import/extensions
import CekbrandSplashScreenContent from '@/views/apps/cekbrand/cekbrand-splash-screen/CekbrandSplashScreenContent'

export default {
  components: {
    Swiper,
    SwiperSlide,
    BImg,
    BModal,
    BButton,
    CekbrandSplashScreenContent,
  },
  data() {
    return {
      splashScreenItems: [
        {
          category: 'competitor',
          name: 'Kompetitor',
          description: '<h5>Bandingkan <span class="font-italic">insight</span> akun dan konten dari kompetitor-kompetitormu berbarengan sekaligus. Mereka sampai mana, ya?</h5>',
        },
        {
          category: 'statistic',
          name: 'Statistik',
          description: '<h5>Analisis Instagram-nya lengkap, mudah dibaca, dan rapi. Bisa langsung dipresentasikan ke tim!</h5>',
        },
        {
          category: 'post',
          name: 'Top Post',
          description: '<h5>Setiap kontenmu yang punya performa terbaik akan di-<span class="font-italic">ranking</span>. Jadi mudah mantaunya, deh!</h5>',
        },
      ],
      swiperOptions: {
        loop: false,
        direction: 'horizontal',
        initialSlide: 0,
        slidesPerView: 1,
        spaceBetween: 100,
        centeredSlides: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
        },
      },
    }
  },
  methods: {
    showModal() {
      this.$refs.refSplashScreenModal.show()
    },
    hideModal() {
      this.$refs.refSplashScreenModal.hide()
    },
  },
}
</script>
<style lang="scss">
@import "@/assets/scss/vue/apps/cekbrand-splash-screen.scss";
</style>
