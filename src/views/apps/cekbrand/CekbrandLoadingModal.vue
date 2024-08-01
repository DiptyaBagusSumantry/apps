<!-- eslint-disable global-require -->
<template>
  <b-modal
    id="cekbrand-loading-modal"
    hide-footer
    centered
    size="lg"
    v-model="isFetchDataOnProgress"
  >
    <div>
      <div class="mb-2">
        <swiper :options="swiperOption">
          <swiper-slide class="d-flex justify-content-center" v-for="(meme, idx) in memes" :key="idx">
            <img :src="meme" alt="">
          </swiper-slide>
        </swiper>
      </div>
      <div class="d-flex justify-content-center mb-2">
        <b-progress height="16px" value="100" class="progress-bar progress-bar-striped progress-bar-animated" />
      </div>
      <div class="text-center">
        <h4 class="font-weight-bolder mb-50">Tunggu sebentar ya</h4>
        <p class="mb-0">Kami sedang memproses data akunmu</p>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { BProgress, BModal } from 'bootstrap-vue'
import 'swiper/swiper-bundle.css' // Updated import path
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

export default {
  components: {
    BProgress,
    BModal,
    Swiper,
    SwiperSlide,
  },
  props: {
    isFetchDataOnProgress: {
      type: Boolean,
    },
  },
  data() {
    return {
      memes: [
        // eslint-disable-next-line global-require
        require('@/assets/images/pages/cekbrand/loading/meme1.png'),
        // eslint-disable-next-line global-require
        require('@/assets/images/pages/cekbrand/loading/meme2.jpg'),
        // eslint-disable-next-line global-require
        require('@/assets/images/pages/cekbrand/loading/meme3.jpg'),
        // eslint-disable-next-line global-require
        require('@/assets/images/pages/cekbrand/loading/meme4.jpg'),
        // eslint-disable-next-line global-require
        require('@/assets/images/pages/cekbrand/loading/meme5.jpg'),
      ],
      swiperOption: {
        loop: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
      },
    }
  },
  created() {
    this.shuffleMemes()
  },
  methods: {
    shuffleMemes() {
      this.memes.sort(() => Math.random() - 0.5)
    },
  },
}
</script>

<style lang="scss" scoped>
@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

@keyframes progress-bar-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

.progress {
  display: -ms-flexbox;
  display: flex;
  height: 1rem;
  overflow: hidden;
  line-height: 0;
  font-size: 0.75rem;
  background-color: #e9ecef;
  border-radius: 1rem;
}

.progress-bar {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background-color: #368AC8;
  transition: width 0.6s ease;
  width: 235px;
}

.progress-bar-striped {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-size: 1rem 1rem;
}

.progress-bar-animated {
  -webkit-animation: 1s linear infinite progress-bar-stripes;
  animation: 1s linear infinite progress-bar-stripes;
}

.swiper-slide {
  img {
    width: 100% !important;
    object-fit: contain;
  }
}
</style>

<style lang="scss">
#cekbrand-loading-modal {
  .modal-content {
    max-width: 720px;
    .modal-body {
      padding: 3rem 3rem;
      img {
        height: 320px;
        width: auto;
      }

      /* Mobile Size */
      @media only screen and (max-width: 768px) {
        padding: 1rem 1rem;

        img {
          height: 220px;
        }
      }
    }
  }

  .modal-header {
    display: none;
  }
}
</style>
