import { ref, watch, computed } from '@vue/composition-api'
import { title } from '@core/utils/filter'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import Swal from 'sweetalert2'

export default function useUsersList() {
  // Use toast
  const toast = useToast()

  const refUserListCard = ref(null)
  const refUserListTable = ref(null)

  const formatDate = (date => new Date(date).toLocaleDateString(
    'id-ID', { year: 'numeric', month: 'long', day: '2-digit' },
  ))

  // Table Handlers
  const tableColumns = [
    {
      key: 'first_name',
      label: 'Nama User',
      sortable: true,
      stickyColumn: true,
      variant: 'light',
      formatter: title,
      class: 'td-fixed-3',
    },
    {
      key: 'email',
      label: 'Alamat Email',
      sortable: true,
      class: 'td-fixed-3',
    },
    {
      key: 'phone',
      label: 'No HP',
      class: 'td-fixed-3',
    },
    {
      key: 'category',
      label: 'Kategori',
      class: 'td-fixed-3',
    },
    {
      key: 'last_login',
      label: 'Terakhir Login',
      sortable: true,
      formatter: formatDate,
      class: 'td-fixed-2',
    },
    {
      key: 'date_joined',
      label: 'Tanggal Daftar',
      sortable: true,
      formatter: formatDate,
      class: 'td-fixed-2',
    },
    {
      key: 'subscription',
      label: 'Subscription',
    },
    {
      key: 'subscriptionStatus',
      label: 'Status',
    },
    {
      key: 'subscriptionStart',
      label: 'Subscription Mulai',
      class: 'td-fixed-3',
    },
    {
      key: 'subscriptionEnd',
      label: 'Subscription Selesai',
      class: 'td-fixed-3',
    },
    {
      key: 'addNewInvoice',
      label: '',
    },
  ]
  const perPage = ref(10)
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('date_joined')
  const isSortDirDesc = ref(true)
  const subscriptionFilter = ref(null)
  const subscriptionStatusFilter = ref(null)
  const categoryFilter = ref(null)

  const tableItems = ref([])

  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value ? refUserListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUsers.value,
    }
  })

  const refreshData = () => {
    refUserListTable.value.refresh()
  }

  const fetchUsers = () => {
    refUserListCard.value.showLoading = true

    const ordering = `${isSortDirDesc.value ? '-' : ''}${sortBy.value}`

    return store
      .dispatch('app-user/fetchUsers', {
        ordering,
        search: searchQuery.value,
        page_size: perPage.value,
        page: currentPage.value,
        group: subscriptionFilter.value,
        status: subscriptionStatusFilter.value,
        category_id: categoryFilter.value,
        product_id: 1,
      })
      .then(response => {
        const { results: users, count: total } = response.data

        tableItems.value = users
        totalUsers.value = total

        refreshData()
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching users list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
      .finally(() => { refUserListCard.value.showLoading = false })
  }

  watch([currentPage, perPage, sortBy, isSortDirDesc, subscriptionFilter, subscriptionStatusFilter, categoryFilter], () => {
    fetchUsers()
  })

  const subscriptionOptions = ref([])

  const fetchSubscriptionGroups = () => store
    .dispatch('app-user/fetchSubscriptionGroups')
    .then(response => {
      subscriptionOptions.value = response.data
        .filter(d => d.name !== 'admin')
    })
    .catch(() => {
      toast({
        component: ToastificationContent,
        props: {
          title: 'Error fetching subscription group list',
          icon: 'AlertTriangleIcon',
          variant: 'danger',
        },
      })
    })

  const subscriptionPeriodOptions = ref([])

  /**
   * This is just simplify how to map subscription period option
   * @param {plan} a Object which contains subcription plan data
   */
  const resolveSubscriptionPeriodOption = plan => {
    const name = `${plan.period_days} hari (${plan.name.toLowerCase()})`
    return {
      id: plan.id,
      name,
      period_days: plan.period_days,
      price: plan.price,
    }
  }

  const fetchSubscriptionPlans = () => store
    .dispatch('app-user/fetchSubscriptionPlans', { product_id: 1 })
    .then(response => {
      subscriptionPeriodOptions.value = response.data.map(d => (resolveSubscriptionPeriodOption(d)))
      subscriptionPeriodOptions.value.push({
        id: null,
        name: 'Kustom',
        period_days: null,
        price: null,
      })
    })
    .catch(() => {
      toast({
        component: ToastificationContent,
        props: {
          title: 'Error fetching subscription plan list',
          icon: 'AlertTriangleIcon',
          variant: 'danger',
        },
      })
    })

  const categoryOptions = ref([])

  const fetchUserCategories = () => store
    .dispatch('app-user/fetchUserCategories')
    .then(response => {
      categoryOptions.value = response.data
    })
    .catch(() => {
      toast({
        component: ToastificationContent,
        props: {
          title: 'Error fetching subscription group list',
          icon: 'AlertTriangleIcon',
          variant: 'danger',
        },
      })
    })

  const isAddNewInvoiceSidebarActive = ref(false)

  const addInvoice = val => {
    const { subscription } = val
    const now = new Date()

    const subcriptionData = {
      id: subscription.id,
      user: val.user_id,
      group: subscription.group.id,
      product: 1,
      plan: subscription.plan.id,
      period_start: new Date(
        new Date(subscription.period_start)
          .setHours(now.getHours(), now.getMinutes(), now.getSeconds()),
      ).toISOString(),
      period_end: new Date(
        new Date(subscription.period_end)
          .setHours(now.getHours(), now.getMinutes(), now.getSeconds()),
      ).toISOString(),
      price: Number(val.price),
      tax_aggregate: val.tax_aggregate,
    }

    // Clean payload, delete element if value is null
    Object.keys(subcriptionData).forEach(key => {
      if (subcriptionData[key] === null) {
        delete subcriptionData[key]
      }
    })

    return store
      .dispatch('app-user/addUserSubscription', subcriptionData)
      .then(() => {
        fetchUsers()

        // Close sidebar
        isAddNewInvoiceSidebarActive.value = false

        Swal.fire({
          title: 'Invoice Berhasil Dibuat',
          text: `Anda berhasil membuat invoice untuk ${title(`${val.first_name} ${val.last_name}`.trim())}`,
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
        })
      })
      .catch(error => {
        if (error.response) {
          const { data: errorData, statusText: errorStatus } = error.response
          toast({
            component: ToastificationContent,
            props: {
              title: errorStatus,
              icon: 'AlertTriangleIcon',
              variant: 'danger',
              text: errorData.detail || errorData.message || errorData,
            },
          })
        }
      })
  }

  // *===============================================*
  // *--------------------- UI ----------------------*
  // *===============================================*

  const resolveUserStatusVariant = subscription => {
    if (!subscription.period_end) return { status: null, variant: 'secondary' }
    if (subscription.status === 'ended' || Date.now() > new Date(subscription.period_end)) return { status: 'Tidak Aktif', variant: 'danger' }
    if (subscription.status === 'canceled') return { status: 'Dibatalkan', variant: 'warning' }
    return { status: 'Aktif', variant: 'success' }
  }

  /**
   * Return user subscription period in days (to determine correct plan)
   * @param {subscription} a Object which contains subcription data
   */
  const getUserSubscriptionPeriod = subscription => {
    const periodStart = new Date(subscription.period_start).toDateString()
    const periodEnd = new Date(subscription.period_end).toDateString()
    return (new Date(periodEnd).getTime() - new Date(periodStart).getTime()) / (1000 * 3600 * 24) + 1
  }

  return {
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
    resolveSubscriptionPeriodOption,
    resolveUserStatusVariant,
    formatDate,

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
    getUserSubscriptionPeriod,
  }
}
