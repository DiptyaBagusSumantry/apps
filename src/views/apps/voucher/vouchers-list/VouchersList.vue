<template>
  <div>
    <b-row class="match-height">
      <b-col
        v-if="voucherChart.series.length > 0"
        xl="4"
      >
        <b-card>
          <b-card-title>
            Grafik Penggunaan Kupon
          </b-card-title>

          <vue-apex-charts
            type="pie"
            height="350"
            :options="voucherChart.chartOptions"
            :series="voucherChart.series"
          />

          <div class="overflow-auto mt-1" id="chart-body">
            <div
              v-for="(voucher, index) in sortedVouchers"
              :key="index"
              class="d-flex flex-row align-items-center"
            >
              <ul class="list-unstyled">
                <li>
                  <span
                    class="bullet bullet-sm bullet-primary mr-1"
                    :style="{ backgroundColor: `${voucherChart.chartOptions.colors[index]}` }"
                  />
                  <span class="d-inline-block">{{ voucher.name }}</span>
                </li>
              </ul>
              <ul class="ml-auto mr-1 list-unstyled">
                <li><span>{{ voucher.usage_count }}</span></li>
              </ul>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col
        xl="8"
      >
        <claimed-vouchers-list />
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <!-- Voucher Handler -->
        <voucher-list-handler-sidebar
          v-model="isVoucherHandlerSidebarActive"
          :voucher="voucher"
          :clear-voucher-data="clearVoucherData"
          @refresh="fetchVouchers"
        />

        <!-- Table Container Card -->
        <b-card-actions
          title="Daftar Kupon"
          ref="refVoucherListCard"
          action-refresh
          no-body
          class="mb-0"
          @refresh="fetchVouchers"
        >

          <div class="m-2">

            <!-- Table Top -->
            <b-row>

              <!-- Per Page -->
              <b-col
                cols="12"
                md="6"
                class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
              >
                <label>Show</label>
                <v-select
                  v-model="perPage"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="perPageOptions"
                  :clearable="false"
                  class="per-page-selector d-inline-block mx-50"
                />
                <label>entries</label>
              </b-col>

              <!-- Search -->
              <b-col
                cols="12"
                md="6"
              >
                <div class="d-flex align-items-center justify-content-end">
                  <b-form-input
                    v-model="searchQuery"
                    class="d-inline-block mr-1"
                    placeholder="Search..."
                  />
                  <b-button
                    variant="primary"
                    @click="isVoucherHandlerSidebarActive = true"
                  >
                    <span class="text-nowrap">Tambah Kupon</span>
                  </b-button>
                </div>
              </b-col>
            </b-row>

          </div>

          <b-table
            ref="refVoucherListTable"
            class="position-relative"
            :items="tableItems"
            responsive
            :fields="tableColumns"
            primary-key="id"
            :sort-by.sync="sortBy"
            show-empty
            empty-text="No matching records found"
            :sort-desc.sync="isSortDirDesc"
          >

            <!-- Column: Actions -->
            <template #cell(actions)="data">
              <div class="text-nowrap">
                <feather-icon
                  :id="`voucher-row-${data.item.id}-edit-icon`"
                  icon="EditIcon"
                  svgClasses="w-5 h-5"
                  class="mr-50 cursor-pointer"
                  @click="editVoucher(data.item)"
                />
                <b-tooltip
                  title="Edit Kupon"
                  class="cursor-pointer"
                  :target="`voucher-row-${data.item.id}-edit-icon`"
                />

                <feather-icon
                  :id="`voucher-row-${data.item.id}-transh-icon`"
                  icon="TrashIcon"
                  svgClasses="w-5 h-5"
                  class="mr-50 cursor-pointer"
                  @click="confirmRemove(data.item)"
                />
                <b-tooltip
                  title="Hapus Kupon"
                  class="cursor-pointer"
                  :target="`voucher-row-${data.item.id}-transh-icon`"
                />
              </div>
            </template>

          </b-table>
          <div class="mx-2 mb-2">
            <b-row>

              <b-col
                cols="12"
                sm="6"
                class="d-flex align-items-center justify-content-center justify-content-sm-start"
              >
                <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
              </b-col>
              <!-- Pagination -->
              <b-col
                cols="12"
                sm="6"
                class="d-flex align-items-center justify-content-center justify-content-sm-end"
              >

                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalVouchers"
                  :per-page="perPage"
                  first-number
                  last-number
                  class="mb-0 mt-1 mt-sm-0"
                  prev-class="prev-item"
                  next-class="next-item"
                >
                  <template #prev-text>
                    <feather-icon
                      icon="ChevronLeftIcon"
                      size="18"
                    />
                  </template>
                  <template #next-text>
                    <feather-icon
                      icon="ChevronRightIcon"
                      size="18"
                    />
                  </template>
                </b-pagination>

              </b-col>

            </b-row>
          </div>
        </b-card-actions>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import {
  BCard, BCardTitle, BRow, BCol, BFormInput, BButton, BTable,
  BDropdown, BDropdownItem, BPagination, BTooltip,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import store from '@/store'
import { ref, onUnmounted, onMounted } from '@vue/composition-api'
import useVouchersList from './useVouchersList'
import vocuherStoreModule from '../voucherStoreModule'
import VoucherListHandlerSidebar from './VoucherListHandlerSidebar.vue'
import ClaimedVouchersList from '../claimed-vouchers-list/ClaimedVouchersList.vue'
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    VoucherListHandlerSidebar,
    ClaimedVouchersList,

    VueApexCharts,
    BCardActions,
    BCard,
    BCardTitle,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,

    vSelect,
  },
  methods: {
    confirmRemove(voucherData) {
      this.voucher = voucherData

      this.$swal({
        title: 'Anda yakin?',
        text: `Anda akan menghapus kupon ${this.voucher.code}`,
        icon: 'warning',
        showCancelButton: true,
        confirmCancelText: 'Batalkan',
        confirmButtonText: 'Hapus',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.removeVoucher()
        }
      })
    },
  },
  setup() {
    const VOUCHER_APP_STORE_MODULE_NAME = 'app-voucher'

    // Register module
    if (!store.hasModule(VOUCHER_APP_STORE_MODULE_NAME)) store.registerModule(VOUCHER_APP_STORE_MODULE_NAME, vocuherStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(VOUCHER_APP_STORE_MODULE_NAME)) store.unregisterModule(VOUCHER_APP_STORE_MODULE_NAME)
    })

    const {
      tableColumns,
      tableItems,
      perPage,
      currentPage,
      blankVoucher,
      voucher,
      vouchers,
      sortedVouchers,
      totalVouchers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refVoucherListCard,
      refVoucherListTable,

      fetchVouchers,
      removeVoucher,

      // Chart
      voucherChart,
    } = useVouchersList()

    onMounted(() => {
      // For initial loading
      refVoucherListCard.value.showLoading = true
      fetchVouchers()
    })

    const clearVoucherData = () => {
      voucher.value = JSON.parse(JSON.stringify(blankVoucher))
    }

    const isVoucherHandlerSidebarActive = ref(false)

    const editVoucher = voucherData => {
      voucher.value = voucherData
      isVoucherHandlerSidebarActive.value = true
    }

    return {
      // Sidebar
      isVoucherHandlerSidebarActive,

      tableColumns,
      tableItems,
      perPage,
      currentPage,
      voucher,
      vouchers,
      sortedVouchers,
      totalVouchers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refVoucherListCard,
      refVoucherListTable,

      clearVoucherData,
      fetchVouchers,
      editVoucher,
      removeVoucher,

      // Chart
      voucherChart,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/base/bootstrap-extended/_variables.scss';

.card-title {
  color: $gray-400;
  font-size: 1.714rem !important;
}

#chart-body {
  max-height: 12rem;
}
</style>
