<template>
  <b-card
    class="account-list w-100"
    no-body
  >
    <div class="d-flex align-items-center section-title">
      <h2 class="font-weight-bolder text-dark my-0">
        Bandingkan akun kompetitor
      </h2>
      <feather-icon
        id="popover-compare-competitor"
        icon="HelpCircleIcon"
        size="20"
        class="text-muted cursor-pointer"
      />
    </div>
    <b-popover
      target="popover-compare-competitor"
      triggers="hover"
      placement="top"
      custom-class="cekbrand-dashboard-popover"
    >
      <span>Membandingkan performa akun-akun kompetitor yang telah kamu tambahkan.</span>
    </b-popover>

    <div class="dashboard-kompetitor-accounts">
      <div
        v-if="windowWidth >= 1140 || download"
        class="d-flex p-2 overflow-x"
      >
        <b-card
          class="account-item mr-2 my-0"
          no-body
        >
          <div class="d-flex flex-column align-items-center">
            <b-avatar
              class="mb-1"
              :src="activeAccountData.profile_picture_url"
              size="80px"
            />
            <span class="text-black">
              @{{ activeAccountData.username }}
            </span>
          </div>
          <div class="account-label account-label-absolute d-flex justify-content-center align-items-center">
            <span class="text-center text-white">
              Akun Anda
            </span>
          </div>
        </b-card>
        <b-card
          v-for="competitorData in userCompetitorList" :key="competitorData.id"
          class="account-item mr-2 my-0"
          no-body
        >
          <div class="d-flex flex-column align-items-center">
            <b-avatar
              class="mb-1"
              :src="competitorData.profile_picture_url"
              size="80px"
            />
            <span class="text-black">
              @{{ competitorData.username }}
            </span>
            <b-button
              class="remove-account p-0 mt-1"
              variant="outline-danger"
              @click="deleteCompetitorConfirm(competitorData)"
            >
              Hapus
            </b-button>
          </div>
        </b-card>
        <div class="dashboard-kompetitor-add-accounts">
          <b-card
            class="add-account my-0 cursor-pointer "
            no-body
            @click="onAddCompetitorClick"
          >
            <div class="d-flex flex-column align-items-center justify-content-center">
              <feather-icon
                icon="PlusCircleIcon"
                width="54px"
                height="54px"
                :stroke="isCompetitorListExceedLimit? '#FF63DE' : '#368AC8'"
              />
              <span
                class="text-primary font-weight-bolder text-center"
                :class="`${isCompetitorListExceedLimit ? 'text-purple-gradient' : 'text-primary'} font-weight-bold`"
              >
                Tambah Kompetitor
              </span>
            </div>
          </b-card>
        </div>
      </div>
      <div v-else>
        <div class="d-flex align-items-center justify-content-between pt-1 px-2">
          <div class="d-flex align-items-center">
            <b-avatar
              class="profile-picture__mobile rounded-full shadow-md"
              :src="activeAccountData.profile_picture_url"
              alt=""
            />
            <p class="ml-1 mt-1 text-black font-light">
              @{{ activeAccountData.username }}
            </p>
          </div>
          <div class="d-flex align-items-center">
            <b-button
              class="account-label p-0"
              variant="gradient-primary"
            >
              <span>
                Akun Anda
              </span>
            </b-button>
          </div>
        </div>
        <div
          v-for="competitorData in userCompetitorList" :key="competitorData.id"
          class="d-flex align-items-center justify-content-between px-2"
        >
          <div class="d-flex align-items-center">
            <b-avatar
              class="profile-picture__mobile rounded-full shadow-md"
              :src="competitorData.profile_picture_url"
              alt="competitor profil picture"
            />
            <p class="ml-1 mt-1 text-black font-light">
              @{{ competitorData.username }}
            </p>
          </div>
          <b-button
            variant="outline-danger"
            class="account-delete p-0"
            @click="deleteCompetitorConfirm(competitorData)"
          >
            Hapus
          </b-button>
        </div>
        <div class="mt-2 d-flex justify-content-center">
          <b-button
            class="d-flex align-items-center"
            :variant="isCompetitorListExceedLimit ? 'purple-gradient' : 'outline-primary'"
            @click="onAddCompetitorClick"
          >
            <div class="d-flex align-items-center justify-content-center">
              <feather-icon
                icon="PlusCircleIcon"
                class="mr-1"
                :color="isCompetitorListExceedLimit? '#FF63DE' : '#368AC8'"
              />
              <span>{{ `Tambah Kompetitor${ isCompetitorListExceedLimit ? ' (upgrade)' : '' }` }}</span>
            </div>
          </b-button>
        </div>
      </div>

      <!-- Modal add confirm competitor -->
      <b-modal
        id="add-competitor-modal"
        centered
        :visible="addCompetitorPrompt"
        hide-header-close
        hide-footer
      >
        <div class="py-1">
          <h4 class="font-weight-bolder mb-2 text-black text-center">Masukkan akun kompetitor</h4>
          <div class="mx-1">
            <b-form-input
              class=""
              placeholder="Ketik username kompetitor tanpa @"
              v-model="submitedCompetitorUsername"
              @keyup.enter="addCompetitor"
              name="username"
            />
          </div>
          <div class="d-flex button-group justify-content-around">
            <b-button
              variant="outline-primary"
              class="font-weight-bolder"
              @click="onAddCompetitorPromptCancel"
            >
              Batalkan
            </b-button>
            <b-button
              variant="primary"
              class="font-weight-bolder"
              @click="addCompetitor"
              :disabled="submitedCompetitorUsername === ''"
            >
              Tambah
            </b-button>
          </div>
        </div>
      </b-modal>

      <!-- Modal deleted confirm competitor -->
      <b-modal
        id="remove-competitor-modal"
        centered
        :visible="deleteCompetitorPrompt"
        hide-header-close
        hide-footer
      >
        <div
          v-if="selectedCompetitor"
          class="py-1"
        >
          <p class="px-1 text-black text-center">
            Hapus
            <span class="font-weight-bolder">
              @{{selectedCompetitor.username}}
            </span>
            dari kompetitor?
          </p>
          <div class="d-flex justify-content-around mt-4">
            <b-button
              variant="outline-primary"
              class="font-weight-bolder"
              @click="onDeleteCompetitorPromptCancel"
            >
              Batalkan
            </b-button>
            <b-button
              variant="danger"
              class="font-weight-bolder"
              @click="deleteCompetitor"
            >
              Hapus
            </b-button>
          </div>
        </div>
      </b-modal>

      <upgrade-subscription-modal ref="refUpgradeSubscriptionModal" />
    </div>
  </b-card>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import {
  BAvatar,
  BButton,
  BCard,
  BPopover,
  BModal,
  BForm,
  BFormInput,
  BBadge,
  BImg,
} from 'bootstrap-vue'
import store from '@/store'

import UpgradeSubscriptionModal from '../components/UpgradeSubscriptionModal.vue'
import useDashboardKompetitorAccounts from './useDashboardKompetitorAccounts'

export default {
  components: {
    BCard,
    BPopover,
    BAvatar,
    BButton,
    BBadge,
    BCard,
    BModal,
    BForm,
    BFormInput,
    BImg,

    UpgradeSubscriptionModal,
  },
  props: {
    download: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const refUpgradeSubscriptionModal = ref(null)

    const {
      // Refs
      submitedCompetitorUsername,
      selectedCompetitor,

      // Modal
      addCompetitorPrompt,
      deleteCompetitorPrompt,

      // Computed
      activeAccountData,
      userCompetitorList,
      isCompetitorListExceedLimit,

      // Methods
      addCompetitor,
      deleteCompetitorConfirm,
      deleteCompetitor,
    } = useDashboardKompetitorAccounts()

    // Computed
    const windowWidth = computed(() => store.state.app.windowWidth)

    // Methods
    const onAddCompetitorClick = () => {
      if (isCompetitorListExceedLimit.value) refUpgradeSubscriptionModal.value.show()
      else addCompetitorPrompt.value = true
    }
    const onAddCompetitorPromptCancel = () => {
      addCompetitorPrompt.value = false
      submitedCompetitorUsername.value = ''
    }
    const onDeleteCompetitorPromptCancel = () => {
      deleteCompetitorPrompt.value = false
      selectedCompetitor.value = null
    }

    return {
      // Refs
      submitedCompetitorUsername,
      selectedCompetitor,

      // Modal
      addCompetitorPrompt,
      deleteCompetitorPrompt,

      refUpgradeSubscriptionModal,

      // Computed
      activeAccountData,
      userCompetitorList,
      isCompetitorListExceedLimit,

      windowWidth,

      // Methods
      addCompetitor,
      deleteCompetitorConfirm,
      deleteCompetitor,
      onAddCompetitorClick,
      onAddCompetitorPromptCancel,
      onDeleteCompetitorPromptCancel,
    }
  }
}
</script>
