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
            Kamu bisa pilih satu atau lebih akun, tergantung dari kuota milih akunmu. Setelah memilih, klik “Hubungkan”
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-5-1.svg')"
            />
          </div>
        </div>
      </app-collapse-item>
    </app-collapse>
  </div>
</template>

<script>
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import { BEmbed, BImg } from 'bootstrap-vue'

export default {
  components: {
    BEmbed,
    BImg,
    AppCollapse,
    AppCollapseItem,
  },
}
</script>