<template>
  <div>
    <vx-card title="">
      <div class="text-center mt-10 mb-12">
        <h2 class="mb-8">Selamat Datang di <a class="font-bold text-primary">Toba.AI</a></h2>
        <p class="font-semibold text-black">
          Toba.AI membutuhkan waktu sekitar 30 menit sampai 1 jam untuk manganalisa instagram anda
        </p>
      </div>
      <div>
        <swiper :options="swiperOption" :dir="$vs.rtl ? 'rtl' : 'ltr'" :key="$vs.rtl">
          <swiper-slide>
            <div class="grid grid-cols-5 items-center gap-12 padding-carousel">
              <div class="responsive col-span-3 image-container">
                <img src="@/assets/images/pages/cekbrand/loading/audiens.png" style="width:100%;" alt="banner">
              </div>
              <div class="col-span-2">
                <h3 class="mb-4 font-light">Fitur</h3>
                <h2 class="mb-5 font-semibold">Audiens</h2>
                <p>
                  Cari tahu siapa audiensmu, mulai dari gender, umur, waktu mereka online, dan dari mana mereka berasal
                </p>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="grid grid-cols-5 items-center gap-12 padding-carousel">
              <div class="responsive col-span-3 image-container">
                <img src="@/assets/images/pages/cekbrand/loading/kompetitor.png" style="width:100%;" alt="banner">
              </div>
              <div class="col-span-2">
                <h3 class="mb-4 font-light">Fitur</h3>
                <h2 class="mb-5 font-semibold">Kompetitor</h2>
                <p>
                  Head-to-head dengan kompetitor agar tetap relevan di dalam persaingan
                </p>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="grid grid-cols-5 items-center gap-12 padding-carousel">
              <div class="responsive col-span-3 image-container">
                <img src="@/assets/images/pages/cekbrand/loading/performa.png" style="width:100%;" alt="banner">
              </div>
              <div class="col-span-2">
                <h3 class="mb-4 font-light">Fitur</h3>
                <h2 class="mb-5 font-semibold">Performa</h2>
                <p>
                  Evaluasi engagement orang-orang di setiap postinganmu serta cari tahu sentimen mereka
                </p>
              </div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-button-prev swiper-button-black swiper-height" slot="button-prev"></div>
          <div class="swiper-button-next swiper-button-black swiper-height" slot="button-next"></div>
        </swiper>
      </div>
    </vx-card>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      activePrompt: false,
      promptTitle: '',
      promptText: '',
      promptTheme: 'primary',

      swiperOption: {
        loop: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  }
}

</script>

<style lang="scss" scoped>
@import "../../../../assets/css/loader.css";

.padding-carousel {
  padding: 0px 70px 60px 70px;
}

.swiper-height {
  height: 20px;
}

.image-container {
  height: 500px;
  overflow: auto;
}

.hide-display {
  display: none;
}

// Scrollbar
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
