<template>
  <section class="cekbrand-dashboard-header d-flex flex-column">
    <div class="account-list mb-1">
      <account-list-drop-down />
    </div>
    <div class="d-flex flex-md-row flex-column account-data">
      <div class="d-flex align-items-center mr-1 mr-lg-2">
        <b-avatar
          size="72"
          variant="light-primary"
          :src="activeAccountData.profile_picture_url"
          style="object-fit:cover"
        />
        <div class="ml-1 ml-lg-2 d-flex flex-column">
          <div class="d-flex mb-25">
            <div class="text-center mr-2">
              <h3 class="font-weight-bolder text-black mb-0">
                {{ latestActiveAccountUserData ? latestActiveAccountUserData.media_count : '-' }}
              </h3>
              <small class="font-small-2">Total Post</small>
            </div>
            <div class="text-center mr-2">
              <h3 class="font-weight-bolder text-black mb-0">
                {{ latestActiveAccountUserData ? latestActiveAccountUserData.followers_count : '-' }}
              </h3>
              <small class="font-small-2">Follower</small>
            </div>
            <div class="text-center">
              <h3 class="font-weight-bolder text-black mb-0">
                {{ latestActiveAccountUserData ? latestActiveAccountUserData.follows_count : '-' }}
              </h3>
              <small class="font-small-2">Following</small>
            </div>
          </div>
          <small
            v-if="latestActiveAccountUserData"
            class="font-small-1 text-muted"
          >
            Data di-update tanggal {{ resolveUpdatedTimestamp().date }}, jam {{ resolveUpdatedTimestamp().time }} WIB
          </small>
        </div>
      </div>
      <div class="ml-md-auto mt-1 d-flex">
        <div class="filter-data w-100 d-block mb-0 mt-auto">
          <date-filter />
        </div>
        <div class="download-data ml-1 ml-lg-2 mt-auto">
          <download-data />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  BAvatar,
} from 'bootstrap-vue'
import { computed } from '@vue/composition-api'
import store from '@/store'

import AccountListDropDown from './components/AccountListDropDown.vue'
import DateFilter from './components/DateFilter.vue'
import DownloadData from './components/download-data/DownloadData.vue'

export default {
  components: {
    BAvatar,

    AccountListDropDown,
    DateFilter,
    DownloadData,
  },
  setup() {
    const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
    const latestActiveAccountUserData = computed(() => {
      return activeAccountData.value.latest_user_data
    })

    const resolveUpdatedTimestamp = () => {
      const { updated_timestamp: updatedTimestamp } = latestActiveAccountUserData.value
      return {
        date: new Date(updatedTimestamp).toLocaleDateString('id-ID'),
        time: new Date(updatedTimestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    }

    return {
      activeAccountData,
      latestActiveAccountUserData,

      // UI
      resolveUpdatedTimestamp,
    }
  }
}
</script>
