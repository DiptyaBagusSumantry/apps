import store from '@/store'
import { useRouter } from '@core/utils/utils'

export default function useCekbrand() {
  const { router } = useRouter()

  const connectFacebook = () => store
    .dispatch('cekbrand/connectSocialAccount', 'facebook')
    .then(response => window.location.replace(response.data))
  const fetchUserAccounts = () => store.dispatch('cekbrand/fetchUserAccountsList')
  const fetchUserFacebookAccounts = () => store
    .dispatch('cekbrand/fetchUserSocialAccountsList', 'facebook')
  const fetchUserAccountInsightsReach = (accountId, queryParams) => store
    .dispatch('cekbrand/fetchUserAccountInsightsReach', { accountId, queryParams })
  const fetchUserAccountInsightsImpressions = (accountId, queryParams) => store
    .dispatch('cekbrand/fetchUserAccountInsightsImpressions', { accountId, queryParams })
  const fetchUserAccountMediaEngagement = (accountId, queryParams) => store
    .dispatch('cekbrand/fetchUserAccountMediaEngagement', { accountId, queryParams })
  const fetchUserAccountUserData = (accountId, queryParams) => store
    .dispatch('cekbrand/fetchUserAccountUserData', { accountId, queryParams })

  const fetchUserAccountInstagram = ({ accountId, payload }) => store
    .dispatch('cekbrand/fetchInstagramData', { accountId, payload })
  const removeUserAccountInstagram = accountId => store
    .dispatch('cekbrand/removeUserAccount', accountId)
  const removeUserAccountFacebook = accountId => store
    .dispatch('cekbrand/removeUserSocialAccount', { accountId, provider: 'facebook' })

  const handleInvalidUserActiveAccountToken = (selectedAccount, error) => {
    if (error.response) {
      const errorResponse = error.response
      if (errorResponse.data) {
        if (errorResponse.data.code === 'invalid_token') {
          router.push({
            name: 'apps-cekbrand-re-authorization',
            params: {
              username: selectedAccount.username,
              socialAccountId: selectedAccount.social_account.id,
            },
          })
        }
      }
    }
  }

  const reAuthorizationUserAccountFacebook = socialAccountId => store
    .dispatch('cekbrand/reAuthorization', { socialAccountId })

  const fetchInstagramBusiness = username => store
    .dispatch('cekbrand/fetchInstagramBusiness', username)

  return {
    fetchUserAccounts,
    fetchUserAccountInsightsReach,
    fetchUserAccountInsightsImpressions,
    fetchUserAccountMediaEngagement,
    fetchUserAccountUserData,
    fetchUserFacebookAccounts,
    fetchUserAccountInstagram,

    connectFacebook,
    removeUserAccountInstagram,
    removeUserAccountFacebook,
    reAuthorizationUserAccountFacebook,

    handleInvalidUserActiveAccountToken,

    fetchInstagramBusiness,
  }
}
