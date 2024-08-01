import { computed } from '@vue/composition-api'
import store from '@/store'

export default function useAccountListDropDown() {
  // Computed
  const userAccountList = computed(() => store.getters['cekbrand/userAccountList'])
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])

  return {
    // Computed
    userAccountList,
    activeAccountData,
  }
}
