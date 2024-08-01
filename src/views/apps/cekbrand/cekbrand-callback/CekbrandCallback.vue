<template>
  <div class="cekbrand-callback pt-2">

    <loading-modal :isFetchDataOnProgress="isReAuthorizationOnProgress" />

    <b-card
      class="d-flex flex-column align-items-center mb-0"
      no-body
    >
      <div class="text-center mb-3">
        <h3 class="font-weight-bolder text-dark mb-2">
          Pilih akun Instagram yang mau kamu hubungkan ke Toba.AI
        </h3>
        <p class="text-dark font-weight-bold mb-2">
          Kalau kuota milih akunmu sisa, kamu masih bisa nambahin akun Instagram pas di Dashboard nanti.
        </p>
        <span class="text-dark d-flex align-items-center justify-content-center">
          Kuota milih akunmu:&nbsp;
          <h3
            v-if="$can('manage', 'all')"
            class="font-weight-bolder text-primary m-0"
          >
            unlimited
          </h3>
          <h3
            v-else
            class="font-weight-bolder m-0"
            :class="`text-${quotaAccounts - selectedAccounts.length ? 'primary' : 'danger'}`"
          >
            {{ quotaAccounts ? quotaAccounts - selectedAccounts.length : '' }}
          </h3>
        </span>
      </div>
      <div class="mb-5 w-100">
        <app-collapse class="w-100">
          <app-collapse-item
            v-for="(socialAccount, idx) in socialAccounts"
            :key="idx"
            title=""
          >
            <template #header>
              <b-avatar
                :src="socialAccount.extra_data.picture ? socialAccount.extra_data.picture.data.url : ''"
                size="33px"
                class="ml-1 mr-3"
                badge-variant="info"
              >
                <template #badge>
                  <b-img :src="require('@/assets/images/icons/facebook.svg')" />
                </template>
              </b-avatar>
              <h4 class="m-0 text-black font-weight-bold">
                {{ socialAccount.extra_data.name }}
              </h4>
              <b-button
                class="ml-auto"
                variant="outline-danger"
                @click="disconnectFb({
                  social_account_id: socialAccount.id,
                  ...socialAccount.extra_data
                })"
              >
                Lepas Tautan Facebook
              </b-button>
            </template>
            <b-form-group v-slot="{ ariaDescribedby }">
              <div class="d-flex flex-wrap">
                <select-account-card
                  v-for="(page, idx) in socialAccount.extra_data.page"
                  :key="idx"
                  class="mx-1"
                  :class="{
                    'selected': selectedAccounts.find(account => account.id === page.instagram_business_account.id)
                  }"
                  :connected="connectedAccounts.find(account => account.id === page.instagram_business_account.id) ? true : false"
                  :used="page.instagram_business_account.connected"
                  :data="page.instagram_business_account"
                  @disconnect="disconnectIg(page.instagram_business_account)"
                >
                  <template #selectAccount>
                    <b-form-checkbox
                      v-model="selectedAccounts"
                      :disabled="isCheckboxDisabled(page.instagram_business_account.id)"
                      :value="{
                        ...page.instagram_business_account,
                        connected: false,
                        onProgress: true,
                        social_account_id: socialAccount.id
                      }"
                      :aria-describedby="ariaDescribedby"
                    />
                  </template>
                </select-account-card>
              </div>
            </b-form-group>
          </app-collapse-item>
        </app-collapse>
      </div>
      <div class="mb-3 text-center">
        <b-button
          class="mx-1"
          variant="link"
          :to="{ name: 'apps-cekbrand' }"
        >
          Kembali
        </b-button>
        <b-button
          class="mx-1"
          :variant="selectedAccounts.length ? 'primary': 'secondary'"
          :disabled="selectedAccounts.length ? false : true"
          @click="$refs.refConfirmModal.showModal()"
        >
          Hubungkan
        </b-button>
      </div>
      <div class="text-center">
        <span>
          Akun yang diinginkan tidak ada? Masuk ke akun
          <a
            class="text-primary"
            @click="connectFacebook"
          >
            Facebook lain
          </a>
        </span>
      </div>
    </b-card>

    <confirm-modal
      ref="refConfirmModal"
      :selected-accounts="selectedAccounts"
      @finished="finishConnectIg()"
    />

    <b-modal
      id="disconnect-modal"
      ref="refDisconnectModal"
      hide-header
      hide-footer
      centered
    >
      <div class="d-block text-center">
        <p v-if="disconnectData.source === 'facebook'">
          Kamu yakin ingin melepaskan koneksi antara akun
          <span class="text-primary">Facebook</span>-mu dan akun
          <strong>
            {{ disconnectData.name }}
          </strong> &nbsp;
          yang telah terhubung?
        </p>
        <p v-else>
          Kamu yakin ingin melepaskan koneksi antara akun
          <span class="text-purple">
            Instagram
          </span>
          dan akun
          <strong>
            {{ disconnectData.name }}
          </strong>
          ?
        </p>
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          class="mr-1"
          variant="outline-primary"
          @click="$refs.refDisconnectModal.hide()"
        >
          Batal
        </b-button>
        <b-button
          variant="danger"
          @click="disconnect()"
        >
          Lepaskan
        </b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
import { ref, onMounted, computed } from '@vue/composition-api'
import { BAvatar, BButton, BCard, BFormCheckbox, BFormGroup, BImg, BModal } from 'bootstrap-vue'
import store from '@/store'
import { isUserSubscribed } from '@/auth/utils'

import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'

import SelectAccountCard from '../components/SelectAccountCard.vue'
import ConfirmModal from './CekbrandCallbackConfirmModal.vue'
import LoadingModal from '../CekbrandLoadingModal.vue'

import useCekbrand from '../useCekbrand'
import router from '@/router'

export default {
  components: {
    BAvatar,
    BButton,
    BCard,
    BFormCheckbox,
    BFormGroup,
    BImg,
    BModal,

    AppCollapse,
    AppCollapseItem,

    SelectAccountCard,
    ConfirmModal,
    LoadingModal,
  },
  setup(props, context) {
    const {
      connectFacebook,
      fetchUserAccounts,
      fetchUserFacebookAccounts,
      removeUserAccountInstagram,
      removeUserAccountFacebook,
      reAuthorizationUserAccountFacebook,
    } = useCekbrand(props, context)

    const socialAccounts = ref([])
    const connectedAccounts = ref([])
    const selectedAccounts = ref([])
    const quotaAccounts = ref(null)
    const refConfirmModal = ref(null)
    const refDisconnectModal = ref(null)
    const disconnectData = ref({
      source: '',
      name: '',
      id: '',
      social_account_id: '',
    })

    const notificationContent = {
      disconnect: {
        variant: 'success',
        title: 'Berhasil Melepaskan Akun',
        content: 'Akun Facebook <strong>Bearded Bulls</strong> berhasil dilepaskan!'
      },
      connect: {
        variant: 'success',
        title: 'Berhasil Menghubungkan Akun',
        content: 'Berhasil menghubungkan 2 akun kamu!'
      },
      fail: {
        variant: 'danger',
        title: 'Gagal Menghubungkan Akun',
        content: 'Silakan coba lagi atau hubungi CS kami.'
      },
    }

    const isReAuthorizationOnProgress = computed(() => {
      return Boolean(store.state.cekbrand.cekBrandLocalInfo.isReAuthorizationOnProgress)
    })
    const activeUserInfo = computed(() => store.state.auth.AppActiveUser)

    const fetchFacebookAccounts = () => {
      fetchUserFacebookAccounts()
        .then(response => {

          const sortedUserSocialAccountsData = [...response.data].sort((a, b) => {
            const lastLoginA = new Date(a.last_login)
            const lastLoginB = new Date(b.last_login)

            return lastLoginB.getTime() - lastLoginA.getTime()
          })

          /* Select the Facebook account that was recently used to login */
          const [latestLogginedSocialAccount] = sortedUserSocialAccountsData

          if (isReAuthorizationOnProgress.value) {
            reAuthorizationUserAccountFacebook(latestLogginedSocialAccount.id)
              .then(() => {
                notification({
                  variant: 'success',
                  title: 'Berhasil Menghubungkan Akun',
                  content: 'Berhasil menghubungkan kembali kamu!'
                })
              })
              .catch(() => {
                notification({
                  variant: 'danger',
                  title: 'Gagal Menghubungkan Akun',
                  content: 'Silakan coba lagi atau hubungi CS kami.'
                })
              })
              .finally(() => router.push({ name: 'apps-cekbrand' }))
            return
          }

          socialAccounts.value = response.data.map(data => {
            let extra_data = data.extra_data
              .replace(/'/gi, '"')
              .replace(/False/gi, 'false')
              .replace(/True/gi, 'true')
            extra_data = JSON.parse(extra_data)
            return {
              ...data,
              extra_data
            }
          })
          fetchAccounts()
        })
    }
    const fetchAccounts = () => {
      fetchUserAccounts()
        .then(async response => {
          connectedAccounts.value = response.data

          const limitIgAccount = {}
          const groups = await store.dispatch('auth/fetchSubscriptionGroups')
          groups.data.forEach(g => {
            limitIgAccount[g.group] = g.limit_ig_account
          })

          const activeUserSubscriptions = activeUserInfo.value.subscriptions
          for (let index = 0; index < activeUserSubscriptions.length; index++) {
            if (activeUserSubscriptions[index].product.id === 1 && isUserSubscribed(activeUserSubscriptions[index])) {
              quotaAccounts.value = limitIgAccount[activeUserSubscriptions[index].group.id] - response.data.length
            }
          }
        })
    }
    const finishConnectIg = () => {
      selectedAccounts.value = []
      fetchAccounts()
    }

    // Start disconnect method
    const disconnect = () => {
      if (disconnectData.value.source === 'instagram') {
        removeUserAccountInstagram(disconnectData.value.id)
          .then(() => {
            const content = `Akun Instagram <strong>${disconnectData.value.name}</strong> berhasil dilepaskan!`
            notification({
              ...notificationContent.disconnect,
              content
            })
            fetchAccounts()
          })
          .catch(() => {
            const title = 'Gagal Melepaskan Akun'
            notification({
              ...notificationContent.fail,
              title
            })
          })
          .finally(() => refDisconnectModal.value.hide())
      } else if (disconnectData.value.source === 'facebook') {
        removeUserAccountFacebook(disconnectData.value.social_account_id)
          .then(() => {
            const content = `Akun Facebook <strong>${disconnectData.value.name}</strong> berhasil dilepaskan!`
            notification({
              ...notificationContent.disconnect,
              content
            })
            fetchFacebookAccounts()
          })
          .catch(() => {
            const title = 'Gagal Melepaskan Akun'
            notification({
              ...notificationContent.fail,
              title
            })
          })
          .finally(() => refDisconnectModal.value.hide())
      }
    }
    const disconnectFb = value => {
      disconnectData.value = {
        ...value,
        source: 'facebook'
      }
      refDisconnectModal.value.show()
    }
    const disconnectIg = value => {
      disconnectData.value = {
        ...value,
        source: 'instagram'
      }
      refDisconnectModal.value.show()
    }
    // End disconnect method

    const isCheckboxDisabled = accountId => {
      return Boolean(
        selectedAccounts.value.length >= quotaAccounts.value && !selectedAccounts.value.find(account => account.id == accountId)
      )
    }
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

    onMounted(() => {
      fetchFacebookAccounts()
    })

    return {
      quotaAccounts,
      selectedAccounts,
      socialAccounts,
      disconnectData,
      refDisconnectModal,
      refConfirmModal,
      notificationContent,
      connectedAccounts,
      isReAuthorizationOnProgress,
      connectFacebook,
      finishConnectIg,
      disconnect,
      disconnectFb,
      disconnectIg,
      isCheckboxDisabled,
      notification,
    }
  }
}
</script>

<style lang="scss">
.cekbrand-callback {
  & > .card {
    padding: 50px 58px 40px 48px;

    .btn {
      width: 200px;
    }
    .collapse-icon {
      .card {
        border-bottom: none;
        margin-bottom: 16px;

        & > .card-header {
          box-shadow: 0px 2px 15px rgb(0 0 0 / 8%);
          border-radius: 8px;
          min-height: 81px;
          max-height: fit-content;
          justify-content: start;

          .b-avatar-badge {
            bottom: 0px;
            right: -8px !important;
          }
          .btn {
            width: 220px;
          }
        }
        & > .collapse > .card-body {
          padding-top: 1rem;
        }
      }
    }
    span {
      a {
        text-decoration: underline;
      }
    }
  }
  .b-avatar-badge {
    background-color: transparent;
    padding: 0px;
  }
  .collapse-icon [aria-expanded=false]:after {
    transform: rotate(0deg);
  }
  .collapse-icon [aria-expanded=true]:after{
    transform: rotate(180deg);
  }
}

#disconnect-modal {
  .btn {
    width: 163px;
  }
  .modal-content {
    width: 410px;

    .modal-body {
      padding: 30px;
    }
    .text-purple {
      color: #c656c6;
    }
  }
}
</style>
