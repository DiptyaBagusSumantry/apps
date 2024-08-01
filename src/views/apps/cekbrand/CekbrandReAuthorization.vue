<template>
  <div
    id="cekbrand-re-authorization"
    class="d-flex flex-column align-items-center justify-content-center mt-1 mt-lg-0"
    style="min-height:80vh"
  >
    <b-card class="d-flex flex-column align-items-center justify-content-center w-md-75 mx-auto text-center p-2 mb-0">
      <div class="d-flex justify-content-center mb-2">
        <b-img
          src="@/assets/images/pages/cekbrand/facebook-auth.png"
          height="250"
        />
      </div>
      <h2 class="mb-2 font-weight-bolder text-black text-center">Koneksi akun Facebook ke Toba.AI kamu terputus</h2>
      <div>
        <p
          class="mx-auto notif-content text-black"
          style="max-width:521px"
        >
          Akun Instagram
          <strong>@{{ $route.params.username }}</strong>
          <strong v-if="socialAccountData.email">
            ({{ socialAccountData.email }})
          </strong>
          dan Facebook
          <strong v-if="socialAccountData.name">{{ socialAccountData.name }}</strong>
          milikmu terputus koneksinya. Tenang, kamu hanya perlu menghubungkan ulang akun Facebook kamu ke Toba.AI.
        </p>
      </div>
      <div class="d-flex mt-2 justify-content-center">
        <b-button
          variant="primary"
          @click="connectFacebook"
        >
          Hubungkan Ulang
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import { BCard, BImg, BButton } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BImg,
    BButton,
  },
  data() {
    return {
      socialAccountData: {},
    }
  },
  methods: {
    connectFacebook () {
      this.$store.dispatch('cekbrand/startReAuthorizationProcess')
        .then(() => {
          this.$store.dispatch('cekbrand/connectSocialAccount', 'facebook')
            .then(response => {
              window.location.replace(response.data)
            })
        })
    }
  },
  created() {
    const { socialAccountId } = this.$route.params
    this.$store.dispatch('cekbrand/fetchUserSocialAccount', { socialAccountId })
      .then(response => {
        this.socialAccountData = JSON.parse(response.data.extra_data
          .replace(/'/gi, '"')
          .replace(/False/gi, 'false')
          .replace(/True/gi, 'true')
        )
      })
  },
}

</script>

