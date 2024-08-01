<template>
  <div id="select-kompetitor">
    <div
      v-if="userCompetitorList"
      class="d-flex justify-content-around"
    >
      <div class="select-kompetitor-option mx-1">
        <div class="user-account-label d-flex justify-content-center align-items-center bg-blue-gradient text-white rounded mx-auto">
          Akun Anda
        </div>
      </div>
      <div class="select-kompetitor-option mx-1">
        <v-select
          v-if="selectedCompetitor1.label"
          v-model="selectedCompetitor1"
          class="mx-auto rounded"
          :class="{
            'mobile-version': (windowWidth <= 992 && !download),
            'bg-red-gradient': (windowWidth > 992 || download)
          }"
          :options="competitorOptions"
          :clearable="false"
      />
      </div>
      <div
        class="select-kompetitor-option mx-1"
        v-if="isShow(3) || download"
      >
        <v-select
          v-if="selectedCompetitor2.label"
          v-model="selectedCompetitor2"
          class="mx-auto bg-green-gradient rounded"
          :options="competitorOptions"
          :clearable="false"
        />
      </div>
      <div
        class="select-kompetitor-option mx-1"
        v-if="isShow(4) || download"
      >
        <v-select
          v-if="selectedCompetitor3.label"
          v-model="selectedCompetitor3"
          class="mx-auto bg-orange-gradient rounded"
          :options="competitorOptions"
          :clearable="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from '@vue/composition-api'
import { useRouter } from '@core/utils/utils'
import store from '@/store'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

import useDashboardKompetitor from './useDashboardKompetitor'
import useDashboardKompetitorAccounts from './useDashboardKompetitorAccounts'

export default {
  components: {
    vSelect
  },
  props: {
    download: {
      type: Boolean,
      default: false,
    },
  },
  setup (props, context) {
    const {
      // Methods
      isShow
    } = useDashboardKompetitor()

    const {
      // Refs
      addCompetitorUsername,
      addCompetitorPrompt,

      // Computed
      userCompetitorList,

      // Method
      onAddCompetitorPromptCancel,
      addCompetitor
    } = useDashboardKompetitorAccounts(props, context)

    const { route } = useRouter()

    // Set selected competitor
    const selectedCompetitor1 = ref({})
    const selectedCompetitor2 = ref({})
    const selectedCompetitor3 = ref({})

    // Computed
    const windowWidth = computed(() => store.state['app'].windowWidth)
    const competitorOptions = computed(() => {
      if (route.value.name === 'cekbrand-download') {
        return JSON.parse(localStorage.getItem('competitorList'))
      }
      return userCompetitorList.value.map(competitor => {
          return {
            id: competitor.id,
            label: `@${competitor.username}`,
            value: competitor.username
          }
        })
    })

    const setSelectedCompetitors = (update = false) => {
      if (route.value.name === 'apps-cekbrand-dashboard') {
        let competitors = []
        if (update) competitors = [selectedCompetitor1.value, selectedCompetitor2.value, selectedCompetitor3.value]
        else {
          const [competitor1 = {label: '-'}, competitor2 = {label: '-'}, competitor3 = {label: '-'}] = competitorOptions.value
          competitors = [competitor1, competitor2, competitor3]
        }
        localStorage.setItem('competitorList', JSON.stringify(competitors))
      }
    }

    onMounted(() => {
      setSelectedCompetitors()
      const [competitor1 = {label: '-'}, competitor2 = {label: '-'}, competitor3 = {label: '-'}] = competitorOptions.value
      selectedCompetitor1.value = competitor1
      selectedCompetitor2.value = competitor2
      selectedCompetitor3.value = competitor3
    })

    // Watch
    watch(userCompetitorList, () => {
      setSelectedCompetitors()
      const [competitor1 = {label: '-'}, competitor2 = {label: '-'}, competitor3 = {label: '-'}] = competitorOptions.value
      selectedCompetitor1.value = competitor1
      selectedCompetitor2.value = competitor2
      selectedCompetitor3.value = competitor3
    })
    watch(selectedCompetitor1, () => {
      setSelectedCompetitors(true)
      context.emit('selectCompetitor', { index: 1, data: selectedCompetitor1.value })
    })
    watch(selectedCompetitor2, () => {
      setSelectedCompetitors(true)
      context.emit('selectCompetitor', { index: 2, data: selectedCompetitor2.value })
    })
    watch(selectedCompetitor3, () => {
      setSelectedCompetitors(true)
      context.emit('selectCompetitor', { index: 3, data: selectedCompetitor3.value })
    })

    return {
      // Refs
      addCompetitorUsername,
      addCompetitorPrompt,
      competitorOptions,
      selectedCompetitor1,
      selectedCompetitor2,
      selectedCompetitor3,

      // Computed
      windowWidth,
      userCompetitorList,

      // Method
      onAddCompetitorPromptCancel,
      addCompetitor,
      isShow,
    }
  }
}
</script>

<style lang="scss" scoped>
.select-kompetitor-option {
  min-width: 256px;
  @media (max-width: 678px) {
    min-width: 200px;
    }
  .v-select {
    height: 48px;
    max-width: 256px;
    .vs__dropdown-toggle {
      border: none;
      height: inherit !important;
    }
  }
  .user-account-label {
    font-weight: 500;
    font-size: 16px;
    height: 48px;
    min-width: 256px;

    @media (max-width: 678px) {
      min-width: 200px;
    }
  }
}
.bg-orange-gradient {
  background: linear-gradient(125deg, #FF8359 0%, rgba(255, 131, 89, 0) 100%), #FFDF40;
}
.bg-green-gradient {
  background: linear-gradient(125deg, #54D169 0%, rgba(84, 209, 105, 0) 100%), #AFF57A;
}
.bg-red-gradient {
  background: linear-gradient(125deg, #F5317F 0%, rgba(245, 49, 127, 0) 100%), #FF7C6E;
}
.bg-blue-gradient {
  background: linear-gradient(279.57deg, #70ADD9 0%, #368AC8 100%), #368AC8;
}
</style>
