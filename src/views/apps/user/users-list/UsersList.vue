<template>

  <div>

    <user-list-add-new-invoice
      :is-add-new-invoice-sidebar-active.sync="isAddNewInvoiceSidebarActive"
      :invoice="invoice"
      :subscription-options="subscriptionOptions"
      :subscription-period-options="subscriptionPeriodOptions"
      @add-invoice="addInvoice"
    />

    <!-- Table Container Card -->
    <b-card-actions
      title="Daftar Pengguna"
      ref="refUserListCard"
      action-refresh
      no-body
      class="mb-0"
      @refresh="fetchUsers"
    >
      <!-- Filters -->
      <users-list-filters
        :subscription-filter.sync="subscriptionFilter"
        :subscription-status-filter.sync="subscriptionStatusFilter"
        :category-filter.sync="categoryFilter"
        :subscription-options="subscriptionOptions"
        :subscription-status-options="subscriptionStatusOptions"
        :category-options="categoryOptions"
      />

      <div class="p-2">

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
                class="d-inline-block"
                placeholder="Search..."
                @keyup.enter="fetchUsers"
              />
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        ref="refUserListTable"
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
      >

        <!-- Column: Nama User -->
        <template #cell(first_name)="data">
          <b-media vertical-align="center" class="align-items-center">
            <template #aside>
              <b-avatar
                size="32"
                :src="data.item.profile ? data.item.profile.photo_url : ''"
                :text="avatarText(`${data.item.first_name} ${data.item.last_name}`)"
                :variant="`light-${resolveUserStatusVariant(data.item.subscription).variant}`"
                :to="{ name: 'apps-users-view', params: { id: data.item.id } }"
              />
            </template>
            <b-link
              :to="{ name: 'apps-users-view', params: { id: data.item.id } }"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ title(`${data.item.first_name} ${data.item.last_name}`.trim()) }}
            </b-link>
          </b-media>
        </template>

        <!-- Column: No HP -->
        <template #cell(phone)="data">
          <span>
            {{ data.item.profile ? data.item.profile.phone : '' }}
          </span>
        </template>

        <!-- Column: Kategori -->
        <template #cell(category)="data">
          <span>
            {{ data.item.profile && data.item.profile.category ? title(data.item.profile.category.name) : '' }}
          </span>
        </template>

        <!-- Column: Subscription -->
        <template #cell(subscription)="data">
          <span v-if="data.value.group">
            {{ title(data.value.group.name) }}
          </span>
        </template>

        <!-- Column: Status -->
        <template #cell(subscriptionStatus)="data">
          <b-badge
            v-if="data.item.subscription['period_end']"
            pill
            :variant="`light-${resolveUserStatusVariant(data.item.subscription).variant}`"
            class="text-capitalize"
          >
            {{ resolveUserStatusVariant(data.item.subscription).status }}
          </b-badge>
        </template>

        <!-- Column: Subscription Mulai -->
        <template #cell(subscriptionStart)="data">
          <span v-if="data.item.subscription['period_start']">
            {{ formatDate(data.item.subscription['period_start']) }}
          </span>
        </template>

        <!-- Column: Subscription Selesai -->
        <template #cell(subscriptionEnd)="data">
          <span v-if="data.item.subscription['period_end']">
            {{ formatDate(data.item.subscription['period_end']) }}
          </span>
        </template>

        <template #cell(addNewInvoice)="data" >
          <b-button
            variant="primary"
            size="sm"
            @click="addNewInvoice(data.item)"
          >
            <span class="text-nowrap">Buat invoice baru</span>
          </b-button>
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
              :total-rows="totalUsers"
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
  BRow, BCol, BFormInput, BBadge, BTable,
  BDropdown, BDropdownItem, BPagination,
  BButton, BMedia, BAvatar, BLink,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import store from '@/store'
import { title } from '@core/utils/filter'
import { isUserSubscribed } from '@/auth/utils'
import { onUnmounted, onMounted, ref } from '@vue/composition-api'
import { avatarText } from '@core/utils/filter'
import useUsersList from './useUsersList'
import userStoreModule from '../userStoreModule'
import UserListAddNewInvoice from './UserListAddNewInvoice.vue'
import UsersListFilters from './UsersListFilters.vue'

export default {
  components: {
    BRow,
    BCol,
    BFormInput,
    BTable,
    BDropdown,
    BDropdownItem,
    BPagination,
    BBadge,
    BButton,
    BMedia,
    BAvatar,
    BLink,

    BCardActions,
    vSelect,

    UserListAddNewInvoice,
    UsersListFilters,
  },
  setup() {
    const USER_APP_STORE_MODULE_NAME = 'app-user'

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    const {
      fetchUsers,
      tableColumns,
      tableItems,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUserListCard,
      refUserListTable,

      // UI
      isAddNewInvoiceSidebarActive,
      subscriptionOptions,
      subscriptionPeriodOptions,
      categoryOptions,

      // Extra Filters
      subscriptionFilter,
      subscriptionStatusFilter,
      categoryFilter,

      addInvoice,
      fetchSubscriptionGroups,
      fetchSubscriptionPlans,
      fetchUserCategories,
      resolveSubscriptionPeriodOption,
      resolveUserStatusVariant,
      getUserSubscriptionPeriod,
      formatDate,
    } = useUsersList()

    onMounted(() => {
      fetchUsers()
    })

    const blankInvoice = {
      user_id: null,
      first_name: '',
      last_name: '',
      subscription: { id: null, plan: null },
      price: null,
      price_paid: null,
      tax_aggregate: null,
    }
    const invoice = ref(JSON.parse(JSON.stringify(blankInvoice)))

    const addNewInvoice = userData => {
      let invoiceData = {
        ...blankInvoice,
        user_id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
      }
      if (isUserSubscribed(userData.subscription)) {
        const { subscription } = userData
        invoiceData = {
          ...invoiceData,
          subscription,
        }
        if (subscription.plan) {
          const { plan } = subscription
          // Make plan name like subscription period option
          invoiceData.subscription.plan = resolveSubscriptionPeriodOption(plan)

          if (![30, 180, 365].includes(getUserSubscriptionPeriod(subscription))) {
            invoiceData.subscription.plan = {
              id: null,
              name: 'Kustom',
              period_days: null,
              price: null,
            }
          }
        }
      }
      if (userData.subscription.id) {
        invoiceData.subscription.id = userData.subscription.id
      }
      invoice.value = invoiceData

      isAddNewInvoiceSidebarActive.value = true
    }

    const subscriptionStatusOptions = [
      { label: 'Aktif', value: 'active' },
      { label: 'Tidak Aktif', value: 'ended' },
      { label: 'Dibatalkan', value: 'canceled' },
    ]


    // Fetch options
    fetchSubscriptionGroups()
    fetchSubscriptionPlans()
    fetchUserCategories()

    return {
      tableColumns,
      tableItems,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUserListCard,
      refUserListTable,
      fetchUsers,

      // Sidebar
      invoice,
      addInvoice,
      addNewInvoice,
      isAddNewInvoiceSidebarActive,

      // Filter
      avatarText,

      // UI
      resolveUserStatusVariant,
      formatDate,
      title,

      subscriptionOptions,
      subscriptionPeriodOptions,
      subscriptionStatusOptions,
      categoryOptions,

      // Extra Filters
      subscriptionFilter,
      subscriptionStatusFilter,
      categoryFilter,
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
@import '~@core/scss/base//bootstrap-extended/_variables.scss';

.td-fixed {
  &-2 {
    min-width: 200px;
  }
  &-3 {
    min-width: 250px;
  }
  &-4 {
    min-width: 300px;
  }
}
.card-title {
  color: $gray-400;
  font-size: 1.714rem !important;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
