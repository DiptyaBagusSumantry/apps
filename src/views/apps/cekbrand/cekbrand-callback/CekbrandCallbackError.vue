<template>
  <div
    id="cekbrand-callback-error"
    class="d-flex justify-content-center align-items-center p-2 pt-lg-5"
  >
    <b-card class="text-center">
      <b-img
        :alt="error.imageFileName"
        fluid
        center
        :src="require(`@/assets/images/pages/cekbrand/callback/${error.imageFileName}`)"
        class="mb-2 mb-lg-3"
      />
      <h2 class="text-black mb-2 font-weight-bolder">{{ error.title }}</h2>
      <p class="mb-2">{{ error.description }}</p>
      <div>
        <b-button
          @click="error.category === 'facebook' ? nextToFB() : nextToIG()"
          variant="primary"
          class="mb-2"
        >
          {{ error.buttonText }}
        </b-button>
      </div>
      <div class="text-un">
        <b-link :to="{
          name: 'apps-cekbrand-onboarding',
          params: { step: error.stepOnboarding } }"
        >
          Tunjukan Carannya
        </b-link>
      </div>
    </b-card>
  </div>
</template>

<script>
import { BCard, BButton, BImg, BLink } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BButton,
    BImg,
    BLink,
  },
  data () {
    return {
      error: {},
      errors: {
        facebook_account_already_used: {
          category: "facebook",
          title: "Yahh.. Akun Facebook-nya sudah dipakai :(",
          description:"Akun Facebook ini sudah dipakai sama akun Toba lain. Masuk lagi tapi pakai akun Facebook yang beda, ya!",
          buttonText: "Masuk Ke Facebook",
          imageFileName: "facebook-already-exist.svg",
          stepOnboarding: 3,
        },
        facebook_not_found: {
          category: "facebook",
          title: "Gagal menghubungkan",
          description:"Ada yang terlewat, Halaman Facebook-nya belum ada. Buat dulu, yuk!",
          buttonText: "Masuk Ke Facebook",
          imageFileName: "facebook-not-found.svg",
          stepOnboarding: 2,
        },
        instagram_not_business: {
          category: "instagram",
          title: "Gagal menghubungkan",
          description:"Akun Instagram-mu belum diubah jadi akun bisnis. Ubah dulu, yuk!",
          buttonText: "Pergi ke Pengaturan IG",
          imageFileName: "instagram-not-business.svg",
          stepOnboarding: 1,
        },
        facebook_not_connected: {
          category: "facebook",
          title: "Gagal menghubungkan",
          description:"Akun Instagram bisnis dan Halaman Facebook-mu belum terhubung. Hubungkan dulu, yuk!",
          buttonText: "Masuk Ke Facebook",
          imageFileName: "facebook-not-connected.svg",
          stepOnboarding: 3,
        },
        permission_denied: {
          category: "facebook",
          title: "Gagal menghubungkan",
          description:"Saat ini Anda tidak memiliki izin untuk menghubungkan akun. Coba beberapa saat lagi ya! Jika masih gagal silahkan hubungi CS kami.",
          buttonText: "Masuk Ke Facebook",
          imageFileName: "facebook-not-found.svg",
        },
      }
    }
  },
  methods: {
    nextToFB() {
      this.$store.dispatch('cekbrand/connectSocialAccount', 'facebook')
        .then(response => {
          window.location.replace(response.data)
        })
    },
    nextToIG() {
      window.open('https://www.instagram.com/', '_blank');
    },
    handleError(routeQuery) {
      if (routeQuery) {
        return this.error = this.errors[routeQuery.code]
      }
    }
  },
  created() {
    this.handleError(this.$route.query)
  }
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';

#cekbrand-callback-error {
  .card {
    width: 729px;
    &-body {
      padding: 40px 100px 32px;
    }
    a {
      text-decoration: underline !important;
    }
  }

  @include media-breakpoint-down(sm) {
    .card-body {
      padding: 2rem;
    }
  }
}
</style>
