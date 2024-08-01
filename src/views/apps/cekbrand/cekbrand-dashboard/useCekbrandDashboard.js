import { computed, ref } from '@vue/composition-api'
import store from '@/store'
import { useRouter } from '@core/utils/utils'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import useCekbrand from '../useCekbrand'

export default function useCekbrandDashboard() {
  const { route } = useRouter()
  const toast = useToast()

  // Reference variables
  const isActiveAccountDataFetched = ref(false)

  // Computed
  const isFetchActiveAccountDataOnProgress = computed(() => Boolean(store.state.cekbrand.isFetchActiveAccountDataOnProgress))

  // Methods

  const notify = (title, message, theme, position = 'bottom-right', timeout = 4000) => {
    toast({
      component: ToastificationContent,
      props: {
        title,
        icon: 'InfoIcon',
        text: message,
        variant: theme,
      },
    },
    {
      position,
      timeout,
    })
  }
  const notifyError = (title, error, theme = 'danger') => {
    // This method is modified from @/mixin/errorMixin.js

    const { data: errorData, status: errorStatusCode, statusText: errorStatus } = error.response

    /*
    Need to nofity internal server error,
    because axiox intercept did not push to under mainatenance page
    */
    if (errorStatusCode >= 500) {
      notify(title, 'Terjadi kesalahan pada sistem kami.', theme)
      return
    }

    const notifyMessage = err => {
      const isObject = obj => (typeof obj === 'object'
                               && obj !== null
                               && !Array.isArray(obj))

      const notMessageKeys = ['code', 'token_class', 'token_type']

      if (isObject(err)) {
        // eslint-disable-next-line
        for (const key in err) {
          if (!notMessageKeys.includes(key)) notifyMessage(err[key])
        }
      } else if (Array.isArray(err)) {
        // Serialize error
        err.forEach(value => {
          notifyMessage(value)
        })
      } else notify(title, err, theme)
    }

    if (errorData) {
      notifyMessage(errorData)
    } else notify(title, errorStatus, theme)
  }

  const { handleInvalidUserActiveAccountToken } = useCekbrand()

  const setInitialUserActiveAccount = () => {
    const { username: selectedAccountUsername } = route.value.params

    store.dispatch('cekbrand/fetchUserAccountsList')
      .then(response => {
        const userAccountList = response.data
        const selectedAccount = userAccountList.find(data => data.username === selectedAccountUsername)

        store.dispatch('cekbrand/fetchUserAccountData', selectedAccount.id)
          .then(() => { isActiveAccountDataFetched.value = true })
          .catch(error => {
            handleInvalidUserActiveAccountToken(selectedAccount, error)
          })
      })
  }

  // Return
  return {
    // Refs
    isActiveAccountDataFetched,
    // Computed
    isFetchActiveAccountDataOnProgress,
    // Methods
    setInitialUserActiveAccount,
    notify,
    notifyError,
    handleInvalidUserActiveAccountToken,
  }
}
