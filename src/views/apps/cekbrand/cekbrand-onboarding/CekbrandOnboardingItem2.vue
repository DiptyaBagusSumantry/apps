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
        <span> Tonton tutorial cara mudah membuat Halaman Facebook </span>
        <div class="d-flex justify-content-center">
          <b-embed
            style="border-radius: 6px"
            type="iframe" aspect="16by9"
            src="https://www.youtube.com/embed/ma1njR7zgmY"
            allowfullscreen />
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
            Buka <strong> Profil Facebook </strong> kamu, lalu di bagian kanan atas halaman Profil, klik <strong> "Buat" </strong> lalu klik <strong> "Halaman" </strong>
          </span>
          <div class="d-flex justify-content-center ">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-2-1.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-4">
          <span>
            <strong> 2. </strong>
            isi informasi tentang Halaman Facebook kamu , lalu klik <strong> "Buat Halaman" </strong>. Tambah foto profil dan foto sampul untuk Halaman Facebook kamu atau lewati tahap ini, klik <strong> "Simpan" </strong>
          </span>
          <div class="d-flex flex-wrap justify-content-around mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-2-2.svg')"
            />
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-2-3.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-4">
          <span>
            <strong> 3. </strong>
            Yeay! Halaman Facebook kamu sudah jadi
          </span>
          <div class="d-flex justify-content-center">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-2-4.svg')"
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