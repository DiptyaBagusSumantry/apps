<template>
  <div>
    <!-- Table Container Card -->
    <b-card-actions
      title="Daftar Penggunaan Kupon"
      ref="refClaimedVoucherListCard"
      action-refresh
      no-body
      class="mb-0"
      @refresh="fetchClaimedVouchers"
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
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        ref="refClaimedVoucherListTable"
        class="position-relative"
        primary-key="id"
        empty-text="No matching records found"
        responsive
        show-empty
        no-local-sorting
        :items="tableItems"
        :fields="tableColumns"
        :sort-by.sync="sortBy"
        :sort-desc.sync="isSortDirDesc"
      />

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
              :total-rows="totalClaimedVouchers"
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
  </div>
</template>

<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import {
  BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BTooltip,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import store from '@/store'
import { onUnmounted, onMounted } from '@vue/composition-api'
import useClaimedVouchersList from './useClaimedVouchersList'
import vocuherStoreModule from '../voucherStoreModule'

export default {
  components: {
    BCardActions,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,

    vSelect,
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
      totalClaimedVouchers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refClaimedVoucherListCard,
      refClaimedVoucherListTable,

      fetchClaimedVouchers,
    } = useClaimedVouchersList()

    onMounted(() => {
      // For initial loading
      refClaimedVoucherListCard.value.showLoading = true
      fetchClaimedVouchers()
    })

    return {
      tableColumns,
      tableItems,
      perPage,
      currentPage,
      totalClaimedVouchers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refClaimedVoucherListCard,
      refClaimedVoucherListTable,

      fetchClaimedVouchers,
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
</style>
