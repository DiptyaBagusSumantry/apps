<template>
  <section>
    <cekbrand-splash-screen ref="refSplashScreenModal" />
    <cekbrand-header />
    <div class="homepage py-2">
      <div class="update-account d-flex">
        <b-button
          class="d-flex align-items-center mr-1"
          variant="primary"
          size="sm"
          @click="showConnectModal"
        >
          <feather-icon
            class="mr-50"
            size="18"
            icon="PlusCircleIcon"
          />
          <p class="m-0">
            Tambah Akun
          </p>
        </b-button>
        <b-button
          id="btn-update"
          variant="outline-primary"
          size="sm"
          :to="{ name: 'apps-cekbrand-callback' }"
        >
          <feather-icon
            size="18"
            icon="UsersIcon"
          />
        </b-button>
        <b-tooltip
          target="btn-update"
          triggers="hover"
          placement="right"
        >
          Kelola Akun
        </b-tooltip>
      </div>
      <div
        v-if="accounts !== null && accounts.length"
        class="d-flex flex-wrap justify-content-center justify-content-sm-start px-0 px-sm-3 mt-2"
      >
        <social-account-card
          v-for="(account, idx) in accounts"
          :key="idx"
          :data="account"
          class="m-1"
        />
      </div>
      <div
        v-else-if="accounts !== null"
        class="mt-5"
      >
        <div class="connect-account text-center mx-auto">
          <b-img
            class="mb-2"
            :src="require('@/assets/images/home/connect-account.svg')"
          />
          <h3 class="font-weight-bolder">
            Ayo, mulai!
          </h3>
          <p class="mb-2">
            Untuk memulai, hubungkan akun Instagram bisnis dengan Halaman Facebook kamu dulu, yuk!
          </p>
          <b-button
            class="d-flex align-items-center mx-auto"
            variant="primary"
            size="sm"
            @click="showConnectModal"
          >
            <feather-icon
              class="mr-1"
              size="18"
              icon="PlusCircleIcon"
            />
            <p class="font-weight-normal m-0">
              Hubungkan Akun
            </p>
          </b-button>
        </div>
      </div>

      <b-modal
        id="connect-modal"
        ref="refConnectModal"
        centered
        hide-footer
        header-bg-variant="white"
      >
        <div class="text-center py-2">
          <b-img
            class="mb-2"
            :src="require('@/assets/images/home/create-new-account.svg')"
          />
          <div class="d-block text-center">
            <h3 class="font-weight-bolder mb-1">
              Tambah Akun Baru
            </h3>
            <span class="text-black">
              Kamu akan diarahkan ke Facebook untuk menghubungkan akun, let's go!
            </span>
          </div>
          <div class="d-flex flex-column align-items-center">
            <b-button
              class="mt-2"
              variant="primary"
              :to="{ name: 'apps-cekbrand-onboarding' }"
            >
              Lihat caranya, yuk!
            </b-button>
            <b-button
              variant="outline-primary"
              @click="connectFacebook()"
            >
              Masuk ke Facebook
            </b-button>
          </div>
        </div>
      </b-modal>
    </div>
    <cekbrand-footer />
  </section>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api'
import { BButton, BImg, BTooltip } from 'bootstrap-vue'

import CekbrandHeader from './CekbrandHeader.vue'
import CekbrandFooter from './CekbrandFooter.vue'
import CekbrandSplashScreen from './cekbrand-splash-screen/CekbrandSplashScreen.vue'

import SocialAccountCard from './components/SocialAccountCard.vue'

import useCekbrand from './useCekbrand'

export default {
  components: {
    BButton,
    BImg,
    BTooltip,
    CekbrandHeader,
    CekbrandFooter,
    CekbrandSplashScreen,

    SocialAccountCard,
  },
  setup(props, context) {
    const {
      connectFacebook,
      fetchUserAccounts,
    } = useCekbrand(props, context)

    const accounts = ref(null)
    const refSplashScreenModal = ref(null)
    const refConnectModal = ref(null)

    onMounted(() => {
      if (!localStorage.getItem('showSplashScreen')) {
        localStorage.setItem('showSplashScreen', true)
        refSplashScreenModal.value.showModal()
      }
      fetchUserAccounts()
        .then(response => accounts.value = response.data)
    })

    const showConnectModal = (val) => {
      refConnectModal.value.show()
    }

    return {
      // Refs
      accounts,
      refSplashScreenModal,
      refConnectModal,
      // Methods
      connectFacebook,
      showConnectModal,
    }
  }
}
</script>

<style lang="scss">
.cekbrand {
  min-width: 435px;

  .homepage {
    background-color: white;
    min-height: 500px;

    .update-account {
      margin-left: 7.5rem
    }
    .connect-account {
      width: 520px;
    }
  }
}

#connect-modal {
  .modal-body {
    .btn {
      width: 185px;

      &.btn-outline-primary {
        margin-top: 5px;
        border: none !important;
      }
    }
  }
}
</style>
