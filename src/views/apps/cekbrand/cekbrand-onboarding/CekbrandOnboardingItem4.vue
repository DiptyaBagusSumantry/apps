<template>
  <div class="collapse-item">
    <app-collapse>
      <app-collapse-item
        title=""
        class="collapse-icon-sub"
      >
        <template #header>
          <span class="sub-title">Video</span>
        </template>
        <span> Tonton tutorial cara mudah menghubungkan Toba.AI - CekBrand dengan Instagram bisnis </span>
        <div class="d-flex justify-content-center">
          <b-embed
            style="border-radius: 6px"
            type="iframe"
            aspect="16by9"
            src="https://www.youtube.com/embed/ma1njR7zgmY"
            allowfullscreen
          />
        </div>
      </app-collapse-item>
      <hr>

      <app-collapse-item
        title=""
        class="collapse-icon-sub"
      >
        <template #header>
          <span class="sub-title">Langkah-Langkah</span>
        </template>
        <div>
          <span>
            <strong> 1. </strong>
            Pastikan anda memiliki akun bisnis Instagram yang terhubung ke Halaman Facebook. Kemudian klik <strong> “Hubungkan ke Facebook” </strong> kemudian Anda akan menuju Facebook. Login ke akun Facebook yang terhubung ke akun bisnis Instagram Anda
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-4-1.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 2. </strong>
            Pilih satu akun Instagram yang ingin kamu hubungkan ke Toba.AI - CekBrand, lalu klik "Selanjutnya".
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-4-2.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 3. </strong>
            Pilih satu akun Instagram yang ingin kamu hubungkan ke Toba.AI - CekBrand, lalu klik "Selanjutnya".
          </span>
          <div class="d-flex flex-wrap justify-content-around mt-2">
            <b-img
              class="m-block"
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-4-3.svg')"
            />
            <b-img
              class="m-block"
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-4-4.svg')"
            />
          </div>
        </div>
      </app-collapse-item>
    </app-collapse>
  </div>
</template>

<script>
import { BEmbed, BImg } from 'bootstrap-vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'

export default {
  components: {
    BEmbed,
    BImg,
    AppCollapse,
    AppCollapseItem,
  },
}
</script>