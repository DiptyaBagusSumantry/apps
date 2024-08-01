<template>
  <div id="download-dashboard-kompetitor">
    <div v-if="page === 1">
      <dashboard-kompetitor-accounts download/>
      <b-card
        class="account-performa w-100"
        no-body
        ref="refKompetitor"
      >
        <div class="select-kompetitor-container-width">
          <dashboard-kompetitor-select-kompetitor download />
        </div>
        <dashboard-kompetitor-performa
          :competitors="[
            selectedCompetitor1,
            selectedCompetitor2,
            selectedCompetitor3
          ]"
          download
        />
      </b-card>
    </div>
    <div v-if="page === 2">
      <b-card
      class="account-performa w-100"
      no-body
      ref="refKompetitor"
    >
      <div class="select-kompetitor-container-width">
        <dashboard-kompetitor-select-kompetitor download />
      </div>
      <div>
        <dashboard-kompetitor-top-content
          :competitors="[
            selectedCompetitor1,
            selectedCompetitor2,
            selectedCompetitor3
          ]"
          download
        />
        <dashboard-kompetitor-top-hashtag
          :competitors="[
            selectedCompetitor1,
            selectedCompetitor2,
            selectedCompetitor3
          ]"
          download
        />
      </div>
    </b-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api'
import { BCard } from 'bootstrap-vue'

import DashboardKompetitorAccounts from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/DashboardKompetitorAccounts'
import DashboardKompetitorPerforma from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/DashboardKompetitorPerforma'
import DashboardKompetitorTopContent from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/DashboardKompetitorTopContent'
import DashboardKompetitorTopHashtag from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/DashboardKompetitorTopHashtag'
import DashboardKompetitorSelectKompetitor from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/DashboardKompetitorSelectKompetitor.vue'

import useDashboardKompetitor from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-kompetitor/useDashboardKompetitor'

export default {
  components: {
    BCard,
    DashboardKompetitorAccounts,
    DashboardKompetitorPerforma,
    DashboardKompetitorTopContent,
    DashboardKompetitorTopHashtag,
    DashboardKompetitorSelectKompetitor,
  },
  props: {
    page: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    const {
      // Computed
      userCompetitorList,
      // Method
      fetchCompetitorsList
    } = useDashboardKompetitor()

    const selectedCompetitor1 = ref({})
    const selectedCompetitor2 = ref({})
    const selectedCompetitor3 = ref({})

    onMounted(async () => {
      await fetchCompetitorsList()
      const [competitor1, competitor2, competitor3] = JSON.parse(localStorage.getItem('competitorList'))
      selectedCompetitor1.value = userCompetitorList.value.find(competitor => competitor.id === competitor1.id)
      selectedCompetitor2.value = userCompetitorList.value.find(competitor => competitor.id === competitor2.id)
      selectedCompetitor3.value = userCompetitorList.value.find(competitor => competitor.id === competitor3.id)
    })

    return {
      // Refs Select Account Kompetitor
      selectedCompetitor1,
      selectedCompetitor2,
      selectedCompetitor3,
      // end
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/vue/apps/cekbrand-dashboard/dashboard-kompetitor.scss";

#download-dashboard-kompetitor {
  .card {
    border: 1px solid #E9EAEB;
    border-radius: 4px;
  }
  .select-kompetitor-container-width {
    width: inherit !important;
  }
}
</style>
