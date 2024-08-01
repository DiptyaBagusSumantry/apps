<template>
  <div id="dashboard-kompetitor">

    <!-- Modal first add competitor -->
    <b-modal
      id="first-add-competitor-modal"
      :visible="firstAddCompetitorPrompt"
      size="xl"
      centered
      hide-footer
      content-class="w-auto"
      body-class="d-flex p-0"
    >
      <div class="d-none d-lg-flex content-left">
        <b-img
          fluid
          src="@/assets/images/pages/cekbrand/dashboard/first-add-competitor.svg"
          class="mt-auto"
        />
      </div>
      <div class="d-flex flex-column p-2 py-lg-3 p-lg-3 px-xl-4 bg-white content-right">
        <h1 class="font-large-1 font-weight-bolder mb-2 mt-lg-2 text-primary">
          Selamat datang di Toba.AI Cek Brand, <span class="text-pink">{{ activeAccountData.name }}</span>!
        </h1>
        <p class="font-medium-1 mb-2">
          Masukkan kompetitor kamu untuk membandingkan performa social media kamu dengan pesaingmu
        </p>

        <b-form
          class="mb-2"
          @submit.prevent
        >
          <div v-for="(input, index) in inputUsernames" :key="index">
            <b-input-group
              class="mb-25"
              :class="{ 'mt-2': index > 0 }"
            >
              <b-form-input
                placeholder="Masukkan username kompetitor tanpa @"
                v-model="input.value"
                :state="input.isValid"
                @keyup.enter="checkCompetitor(index)"
                @input="input.isValid = null"
              />
              <b-input-group-append>
                <b-button
                  :variant="resolveButtonVariantText(index).variant"
                  class="p-50"
                  @click="checkCompetitor(index)"
                >
                  <feather-icon
                    v-if="input.isValid"
                    icon="CheckIcon"
                    size="20"
                  />
                  <span v-else>
                    {{ resolveButtonVariantText(index).text }}
                  </span>
                </b-button>
              </b-input-group-append>
            </b-input-group>
            <small
              v-if="input.isValid !== null && !input.isValid"
              class="text-danger"
            >
              Akun tidak ditemukan. Akun kompetitor haruslah akun bisnis
            </small>
          </div>

          <p class="font-small-3 line-height-1 mt-2 mb-3">
            *Kamu bisa menambahkan atau mengganti daftar kompetitor kamu nanti
          </p>

          <div class="mt-auto d-flex flex">
            <b-button
              variant="link"
              class="py-50 px-1 mr-2"
              @click="firstAddCompetitorPrompt = false"
            >
              Lewati
            </b-button>
            <b-button
              variant="primary"
              class="d-flex align-items-center py-50 px-1"
              type="submit"
              :disabled="invalidInputUsernames"
              @click="addCompetitors"
            >
              <span class="mr-50">Bandingkan kompetitor</span>
              <feather-icon icon="ChevronRightIcon" size="20" />
            </b-button>
          </div>
        </b-form>
      </div>
    </b-modal>

    <dashboard-kompetitor-accounts />

    <b-card
      class="account-performa w-100"
      no-body
      ref="refKompetitor"
    >
      <div ref="refSelectKompetitor"
        :class="{
          'sticky-top': (isSelectorSticky && windowWidth),
          'select-kompetitor-container-width': !isSelectorSticky
        }"
        :style="{ width: `${containerWidth-93}px` }"
      >
        <dashboard-kompetitor-select-kompetitor @selectCompetitor="changeSelectedCompetitor" />
      </div>
      <dashboard-kompetitor-performa
        :competitors="[
          selectedCompetitor1,
          selectedCompetitor2,
          selectedCompetitor3
        ]"
      />
      <div>
        <dashboard-kompetitor-top-content
          :competitors="[
            selectedCompetitor1,
            selectedCompetitor2,
            selectedCompetitor3
          ]"
        />
        <dashboard-kompetitor-top-hashtag
          :competitors="[
            selectedCompetitor1,
            selectedCompetitor2,
            selectedCompetitor3
          ]"
        />
      </div>
    </b-card>
  </div>
</template>

<script>
import { watch, onMounted } from '@vue/composition-api'
import {
  BButton,
  BCard,
  BModal,
  BForm,
  BFormInput,
  BInputGroup,
  BInputGroupAppend,
  BImg,
} from 'bootstrap-vue'

import DashboardKompetitorAccounts from './DashboardKompetitorAccounts'
import DashboardKompetitorPerforma from './DashboardKompetitorPerforma'
import DashboardKompetitorTopContent from './DashboardKompetitorTopContent'
import DashboardKompetitorTopHashtag from './DashboardKompetitorTopHashtag'
import DashboardKompetitorSelectKompetitor from './DashboardKompetitorSelectKompetitor.vue'

import useDashboardKompetitor from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/useDashboardKompetitor'
import useDashboardKompetitorAccounts from './useDashboardKompetitorAccounts'

export default {
  components: {
    BButton,
    BCard,
    BModal,
    BForm,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    BImg,
    DashboardKompetitorAccounts,
    DashboardKompetitorPerforma,
    DashboardKompetitorTopContent,
    DashboardKompetitorTopHashtag,
    DashboardKompetitorSelectKompetitor,
  },
  setup (props, context) {
    const {
      // Refs
      selectedCompetitor1,
      selectedCompetitor2,
      selectedCompetitor3,
      isSelectorSticky,

      // Computed
      activeAccountData,
      containerWidth,
      windowWidth,

      // Method
      handleScroll,
      fetchCompetitorsList,
      changeSelectedCompetitor,
      changeOffsetTopSelectorAccountValue,
    } = useDashboardKompetitor(props, context)

    const {
      // Refs
      inputUsernames,
      // Modal
      firstAddCompetitorPrompt,
      // Computed
      invalidInputUsernames,
      // Methods
      checkCompetitor,
      addCompetitors,
      // UI
      resolveButtonVariantText,
    } = useDashboardKompetitorAccounts()


    // Mounted
    onMounted(async () => {
      const competitor = await fetchCompetitorsList()
      if (competitor.length === 0) firstAddCompetitorPrompt.value = true

      changeOffsetTopSelectorAccountValue()
      window.addEventListener('resize', changeOffsetTopSelectorAccountValue)
      window.addEventListener('scroll', handleScroll)
    })

    // Watch
    watch(activeAccountData, () => { fetchCompetitorsList() })

    return {
      // Refs
      inputUsernames,
      selectedCompetitor1,
      selectedCompetitor2,
      selectedCompetitor3,
      isSelectorSticky,
      // Modal
      firstAddCompetitorPrompt,

      // Computed
      activeAccountData,
      invalidInputUsernames,
      containerWidth,
      windowWidth,

      // Methods
      changeSelectedCompetitor,
      checkCompetitor,
      addCompetitors,
      // UI
      resolveButtonVariantText,
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vue/apps/cekbrand-dashboard/dashboard-kompetitor.scss";
.sticky-top {
  position: fixed;
  top: 80px;
  z-index: 9;
}
.select-kompetitor-container-width {
  width: inherit !important;
}
</style>
