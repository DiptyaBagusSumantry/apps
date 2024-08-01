<template>
  <b-modal
    id="confirm-ig-modal"
    ref="refConfirmModal"
    centered
    hide-footer
    header-bg-variant="white"
    :hide-header-close="connectingProgress > 0"
    no-close-on-backdrop
    no-close-on-esc
  >
    <div class="confirmation-modal p-50 d-flex flex-column">
      <div class="text-center">
        <h3 class="font-weight-bolder mb-1">
          Hubungkan sekarang?
        </h3>
        <p>
          Kamu memilih {{ selectedAccounts.length }} Akun Instagram yang akan dihubungkan
        </p>
      </div>
      <div class="px-5">
        <div
          v-for="(account, idx) in selectedAccounts"
          :key="idx"
          class="my-1 d-flex align-items-center"
        >
          <div class="mr-auto">
            <b-avatar
              :src="account.profile_picture_url"
              size="33px"
              class="mr-1"
              badge-variant="info"
            >
              <template #badge>
                <b-img :src="require('@/assets/images/icons/instagram.svg')" />
              </template>
            </b-avatar>
            <span class="font-weight-bolder">
              {{ account.name }}
            </span>
          </div>
          <b-spinner
            v-if="startFetchData && connectingProgress > 0 && account.onProgress"
            variant="primary"
            label="Spinning"
          />
          <div v-else-if="startFetchData && !account.connected">
            <feather-icon
              icon="XIcon"
              size="23"
              stroke="#ea5455"
              stroke-width="3px"
            />
            <feather-icon
              icon="RefreshCwIcon"
              class="refresh-icon"
              size="23"
              stroke="#5e646a"
              stroke-width="3px"
              @click="connect([account])"
            />
          </div>
          <feather-icon
            v-else-if="startFetchData && account.connected"
            icon="CheckIcon"
            size="23"
            stroke="#44b51f"
            stroke-width="3px"
          />
        </div>
      </div>
      <div class="mt-auto">
        <div
          v-if="!startFetchData"
          class="d-flex flex-column align-items-center mt-2"
        >
          <b-button
            class="font-small-1 font-weight-bolder mb-50"
            variant="primary"
            size="sm"
            @click="connect(selectedAccounts)"
          >
            Ya, Hubungkan Sekarang
          </b-button>
          <b-button
            variant="link font-small-1 font-weight-bolder"
            size="sm"
            @click="hideModal"
          >
            Ubah
          </b-button>
        </div>
        <p
          v-else-if="connectingProgress > 0"
          class="text-center m-0 font-weight-bold"
        >
          Sedang menghubungkan. Tunggu sebentar...
        </p>
        <div
          v-else-if="connectingProgress === 0 && startFetchData"
          class="d-flex justify-content-center"
        >
          <b-button
            class="mt-2"
            variant="primary"
            size="sm"
            :to="{ name: 'apps-cekbrand' }"
          >
            Lanjutkan
          </b-button>
        </div>
      </div>
      </div>
  </b-modal>
</template>

<script>
import { ref } from '@vue/composition-api'
import { BAvatar, BButton, BImg, BModal, BSpinner } from 'bootstrap-vue'

import useCekbrand from '../useCekbrand'

export default {
  props: {
    selectedAccounts: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    BAvatar,
    BButton,
    BImg,
    BModal,
    BSpinner,
  },
  methods: {
    showModal() {
      this.$refs.refConfirmModal.show()
    },
    hideModal() {
      this.$refs.refConfirmModal.hide()
    },
  },
  setup(props, context) {
    const {
      fetchUserAccountInstagram,
    } = useCekbrand(props, context)

    const connectingProgress = ref(0)
    const startFetchData = ref(false)

    const notification = ({ title, content, variant }) => {
      const createElement = context.root.$createElement
      const titleElement = createElement(
        'div',
        { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'mr-2'] },
        [
          createElement('strong', { class: 'mr-2' }, title),
          createElement('small', { class: 'ml-auto text-italics' }, '5 Sec')
        ]
      )
      const contentElement = createElement('span', {
          domProps: {
            innerHTML: content
          }
        }
      )
      context.root.$bvToast.toast([contentElement], {
        title: titleElement,
        variant,
        autoHideDelay: 5000,
        solid: true,
      })
    }

    const connect = accounts => {
      connectingProgress.value += accounts.length

      accounts.forEach(data => {
        startFetchData.value = true
        data.onProgress = true

        const accountId = data.id
        const payload = { id: data.social_account_id }
        fetchUserAccountInstagram({ accountId, payload })
          .then(() => {
            data.connected = true
            notification({
              variant: 'success',
              title: 'Berhasil Menghubungkan Akun',
              content: 'Berhasil Menghubungkan Akun IG'
            })
          })
          .catch((error) => {
            data.connected = false
            notification({
              variant: 'danger',
              title: 'Gagal Menghubungkan Akun IG',
              content: error.response.data.detail
            })
          })
          .finally(() => {
            data.onProgress = false
            connectingProgress.value -= 1
          })
      })
    }

    context.root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if (modalId === 'confirm-ig-modal' && startFetchData.value) {
        context.emit('finished')

        startFetchData.value = false
        connectingProgress.value = 0
      }
    })


    return {
      connectingProgress,
      startFetchData,
      connect,
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables/variables';

.confirmation-modal {
  min-height: 300px;
  .btn {
    width: 185px;
  }
  .b-avatar-badge {
    bottom: 0px;
    right: -2px !important;
    background-color: transparent;
    padding: 0px;

    img {
      width: 16px;
    }
  }
  .refresh-icon {
    cursor: pointer;
    &:hover {
      stroke: $primary;
    }
    margin-left: 5px;
  }
}
</style>
