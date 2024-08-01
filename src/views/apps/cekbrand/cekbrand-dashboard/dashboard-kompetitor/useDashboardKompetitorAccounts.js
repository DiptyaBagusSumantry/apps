import { computed, ref } from '@vue/composition-api'

import useCekbrandDashboard from '@/views/apps/cekbrand/cekbrand-dashboard/useCekbrandDashboard'
import store from '@/store'
import { isUserSubscribed } from '@/auth/utils'
import useCekbrand from '../../useCekbrand'

export default function useDashboardKompetitorAccounts() {
  const { notify, notifyError } = useCekbrandDashboard()
  const { fetchInstagramBusiness } = useCekbrand()

  // Reference
  const submitedCompetitorUsername = ref('')
  const selectedCompetitor = ref(null)
  const blankInputUsernames = [
    { value: '', isValid: null },
    { value: '', isValid: null },
    { value: '', isValid: null },
  ]
  const inputUsernames = ref(blankInputUsernames)

  // Modal
  const firstAddCompetitorPrompt = ref(false)
  const addCompetitorPrompt = ref(false)
  const deleteCompetitorPrompt = ref(false)

  // Computed
  const activeUserInfo = computed(() => store.state.auth.AppActiveUser)
  const limitIgCompetitor = computed(() => {
    const limit = {}
    const groups = store.state.auth.AppSubscriptionGroups
    groups.forEach(g => {
      limit[g.group] = g.limit_ig_competitor
    })
    return limit
  })
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const userCompetitorList = computed(() => store.getters['cekbrand/getUserCompetitorList'])
  const isCompetitorListExceedLimit = computed(() => {
    if (!activeUserInfo.value.isAdmin) {
      const activeUserSubscriptions = activeUserInfo.value.subscriptions
      for (let index = 0; index < activeUserSubscriptions.length; index++) {
        if (activeUserSubscriptions[index].product.id === 1 && isUserSubscribed(activeUserSubscriptions[index])) {
          return userCompetitorList.value.length === limitIgCompetitor.value[activeUserSubscriptions[index].group.id]
        }
      }
      return true
    }
    return false
  })
  const invalidInputUsernames = computed(() => inputUsernames.value.some(u => u.isValid !== null && !u.isValid))

  // Methods
  const addCompetitor = () => {
    if (submitedCompetitorUsername.value === '') return

    const payload = {
      competitorUsername: submitedCompetitorUsername.value,
    }
    store.dispatch('cekbrand/addActiveAccountCompetitor', payload)
      .then(() => notify('Kompetitor Berhasil Ditambahkan', `Selamat! Anda berhasil menambahkan @${submitedCompetitorUsername.value} sebagai Kompetitor.`, 'success'))
      .catch(error => notifyError('Kompetitor Gagal Ditambahkan', error))
      .finally(() => {
        addCompetitorPrompt.value = false
        submitedCompetitorUsername.value = ''
      })
  }
  const deleteCompetitorConfirm = competitorData => {
    deleteCompetitorPrompt.value = true
    selectedCompetitor.value = competitorData
  }
  const deleteCompetitor = () => {
    if (selectedCompetitor.value === null) return

    const payload = {
      competitorId: selectedCompetitor.value.id,
      socialAccountId: activeAccountData.value.social_account.id,
    }
    store.dispatch('cekbrand/removeActiveAccountCompetitor', payload)
      .then(() => notify('Kompetitor Berhasil Dihapus', `Anda berhasil menghapus akun @${selectedCompetitor.value.username} sebagai Kompetitor.`, 'success'))
      .catch(error => notifyError('Kompetitor Gagal Dihapus', error))
      .finally(() => {
        deleteCompetitorPrompt.value = false
        selectedCompetitor.value = null
      })
  }
  const checkCompetitor = inputIndex => {
    const { isValid, value: username } = inputUsernames.value[inputIndex]

    if (isValid !== null || username === '') return null

    return new Promise((resolve, reject) => {
      fetchInstagramBusiness(username)
        .then(() => {
          inputUsernames.value[inputIndex].isValid = true
          resolve(true)
        })
        .catch(error => {
          if (error.response.status < 500) {
            inputUsernames.value[inputIndex].isValid = false
            resolve(false)
          } else {
            notifyError('Kompetitor Gagal Ditambahkan', error)
            reject(error)
          }
        })
    })
  }
  const addCompetitors = async () => {
    if (inputUsernames.value.every(u => u.value === '')) {
      firstAddCompetitorPrompt.value = false
    }

    const newCompetitors = []

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < inputUsernames.value.length; i++) {
      const input = inputUsernames.value[i]

      if (input.isValid === null) await checkCompetitor(i)
      if (input.isValid && !inputUsernames.value.some(u => u.isValid === false)) {
        await store.dispatch('cekbrand/addActiveAccountCompetitor', {
          competitorUsername: input.value,
        })
          .then(() => newCompetitors.push(input.value))
          .catch(error => notifyError('Kompetitor Gagal Ditambahkan', error))
      }
    }
    /* eslint-enable no-await-in-loop */

    if (newCompetitors.length > 0) {
      notify(
        'Kompetitor Berhasil Ditambahkan',
        `Selamat! Anda berhasil menambahkan @${newCompetitors.join(', @')} sebagai Kompetitor.`,
        'success',
      )
      inputUsernames.value = blankInputUsernames
      firstAddCompetitorPrompt.value = false
    }
  }

  // UI
  const resolveButtonVariantText = inputIndex => {
    const input = inputUsernames.value[inputIndex]
    if (input.isValid == null) {
      return { variant: 'primary', text: 'Check' }
    }
    if (input.isValid) {
      return { variant: 'success', text: '' }
    }
    return { variant: 'danger', text: 'Invalid' }
  }

  return {
    // Refs
    selectedCompetitor,
    submitedCompetitorUsername,
    inputUsernames,

    // Modal
    firstAddCompetitorPrompt,
    addCompetitorPrompt,
    deleteCompetitorPrompt,

    // Computed
    activeAccountData,
    userCompetitorList,
    isCompetitorListExceedLimit,
    invalidInputUsernames,

    // Methods
    checkCompetitor,
    addCompetitor,
    addCompetitors,
    deleteCompetitorConfirm,
    deleteCompetitor,
    // UI
    resolveButtonVariantText,
  }
}
