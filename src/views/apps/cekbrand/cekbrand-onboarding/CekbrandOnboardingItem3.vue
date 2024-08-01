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
        <span> Tonton tutorial cara mudah menghubungkan Instagram bisnis dengan Halaman Facebook </span>
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
            Pada beranda, klik <strong> "Halaman" </strong> di menu sebelah kiri.
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-3-1.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 2. </strong>
            Klik Halaman Facebook yang ingin dihubungkan ke akun Instagram bisnis kamu
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-3-2.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 3. </strong>
            Di Halaman Facebook kamu, klik <strong> "Pengaturan" </strong> di menu kiri bawah
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-3-3.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 4. </strong>
            Pilih <strong> "Instagram" </strong> pada menu sebelah kiri
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-3-4.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 5. </strong>
            Pilih <strong> "Hubungkan Akun" </strong>
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-3-5.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 6. </strong>
            Akan muncul notifikasi untuk minta izin akses pesan Instagram. Kalau kamu beri izin, maka orang yang mengelola Halaman Facebook kamu bisa melihat dan menanggapi pesan-pesan dari Instagrammu.
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-3-6.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 7. </strong>
            Masuk dulu ke akun Instagram bisnismu
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-3-7.svg')"
            />
          </div>
        </div>

        <div class="mt-lg-5">
          <span>
            <strong> 8. </strong>
            Yeay! Halaman Facebook berhasil terhubung ke akun Instagrammu.
          </span>
          <div class="d-flex justify-content-center mt-2">
            <b-img
              fluid
              alt="Image"
              :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-3-8.svg')"
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
    AppCollapse,
    AppCollapseItem,
    BEmbed,
    BImg
  },
}
</script>