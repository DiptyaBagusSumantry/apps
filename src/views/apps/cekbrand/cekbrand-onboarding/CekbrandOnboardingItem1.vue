<template>
  <div class="collapse-item mt-2">
    <div>
      <span>
        <strong> 1. </strong>
        Buka profil akun Instagrammu lalu pilih <strong> menu di sudut atas </strong>
      </span>
      <div class="d-flex justify-content-center">
        <b-img
          fluid
          :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-1-1.svg')"/>
        />
      </div>
    </div>

    <div class="mt-lg-4">
      <span>
        <strong> 2. </strong>
        Pilih <strong> "Pengaturan" </strong> lalu pilih <strong> "Akun" </strong> lalu pilih <strong> "Beralih ke Akun Profesional" </strong>
      </span>
      <div class="d-flex flex-wrap justify-content-around">
        <b-img
          fluid
          alt="Image"
          :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-1-2.svg')"
        />
        <b-img
          fluid
          alt="Image"
          :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-1-3.svg')"
        />
        <b-img
          fluid
          alt="Image"
          :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-1-4.svg')"
        />
      </div>
    </div>

    <div class="mt-lg-4">
      <span>
        <strong> 3. </strong>
        Lalu pilih kategori yang sesuai dengan brand-mu dan isi info kontaknya
      </span>
      <div class="d-flex flex-wrap justify-content-around">
        <div class="m-block">
          <b-img
            fluid
            alt="Image"
            :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-1-5.svg')"
          />
        </div>
        <div class="m-block">
          <b-img
            fluid
            alt="Image"
            :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-1-6.svg')"
          />
        </div>
        <div class="m-block">
          <b-img
            fluid
            alt="Image"
            :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-1-7.svg')"
          />
        </div>
      </div>
    </div>

    <div class="mt-lg-4">
      <span>
        <strong> 4. </strong>
        Hubungkan ke akun Instagrammu atau lewati tahap ini dan dihubungkan nanti setelah buat Halaman Facebook
      </span>
      <div class="d-flex justify-content-center">
        <b-img
          fluid
          alt="Image"
          :src="require('@/assets/images/pages/cekbrand/onboarding/collapse-1-8.svg')"
        />
      </div>
    </div>
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