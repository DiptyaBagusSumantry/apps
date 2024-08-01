import { computed } from '@vue/composition-api'
import store from '@/store'

export default function useDownloadDashboard() {
  const dateFilter = JSON.parse(localStorage.getItem('dateFilter'))
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const userCompetitorList = computed(() => store.getters['cekbrand/getUserCompetitorList'])

  const setUserActiveAccount = username => new Promise(resolve => store
    .dispatch('cekbrand/fetchUserAccountsList')
    .then(async response => {
      const userAccountList = response.data
      const selectedAccount = userAccountList.find(value => value.username === username)

      store.dispatch('cekbrand/fetchUserAccountData', selectedAccount.id)
        .then(() => resolve())
    }))

  const exportedDateTime = () => {
    const today = new Date()
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    const timeOptions = { hour: 'numeric', minute: 'numeric' }
    return `${today.toLocaleString('id', dateOptions)} ${today.toLocaleString('id', timeOptions)} WIB`
  }

  return {
    dateFilter,
    activeAccountData,
    userCompetitorList,
    setUserActiveAccount,
    exportedDateTime,
  }
}
