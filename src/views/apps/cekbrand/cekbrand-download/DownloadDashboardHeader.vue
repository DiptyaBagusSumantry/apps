<template>
  <div id="download-dashboard-header">
    <h3 class="font-weight-bolder text-dark header-account">
      {{ activeAccountData.username }}
    </h3>
    <div class="d-flex align-items-center header-detail">
      <b-avatar
        :src="activeAccountData.profile_picture_url"
        size="72px"
      />
      <div class="d-flex flex-column flex-fill">
        <div class="d-flex">
          <div class="header-statistic">
            <h3 class="font-weight-bolder text-dark m-0 text-center">
              {{ latestActiveAccountUserData.media_count }}
            </h3>
            <p class="m-0 text-center">
              Total Post
            </p>
          </div>
          <div class="header-statistic">
            <h3 class="font-weight-bolder text-dark m-0 text-center">
              {{ latestActiveAccountUserData.followers_count }}
            </h3>
            <p class="m-0 text-center">
              Follower
            </p>
          </div>
          <div class="header-statistic">
            <h3 class="font-weight-bolder text-dark m-0 text-center">
              {{ latestActiveAccountUserData.follows_count }}
            </h3>
            <p class="m-0 text-center">
              Following
            </p>
          </div>
        </div>
        <span>
          Data di-update tanggal {{ resolveUpdatedTimestamp().date }}, jam {{ resolveUpdatedTimestamp().time }} WIB
        </span>
      </div>
      <div class="header-date-range d-flex flex-column">
        <span>
          Rentang Waktu
        </span>
        <div>
          {{ resolveDateRange() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { BAvatar } from 'bootstrap-vue'

import useDownloadDashboard from './useDownloadDashboard'
import useDateFilter from '../cekbrand-dashboard/components/useDateFilter'

export default {
  components: {
    BAvatar
  },
  setup (props, context) {
    const {
      activeAccountData
    } = useDownloadDashboard(props, context)
    const {
      // UI
      resolveDateRange
    } = useDateFilter(props, context)

    const latestActiveAccountUserData = computed(() => {
      return activeAccountData.value.userData ? [...activeAccountData.value.userData].pop() : {}
    })

    const resolveUpdatedTimestamp = () => {
      const { updatedTimestamp = new Date() } = latestActiveAccountUserData.value
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
      resolveDateRange
    }
  }
}
</script>

<style lang="scss">
#download-dashboard-header {
  margin-bottom: 64px;

  .header-account {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 16px;
  }
  .header-detail {
    .b-avatar {
      margin-right: 25px;
    }
    .header-statistic {
      margin-bottom: 8px;
      margin-right: 24px;

      h3 {
        font-size: 24px;
        line-height: 32px;
      }
      p {
        color: black;
        font-size: 13px;
        line-height: 16px;
      }
    }
    .header-date-range {
      span {
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 7px;
      }
      div {
        font-size: 14px;
        line-height: 24px;
        border: 1px solid #E9EAEB;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.13);
        border-radius: 5px;
        padding: 8px 10px;
        width: 286px;
      }
    }
    span {
      font-size: 12px;
      line-height: 12px;
    }
  }
}
</style>
