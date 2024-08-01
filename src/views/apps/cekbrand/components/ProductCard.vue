<template>
  <div
    v-if="data.id"
    :class="`product-card bg-${data.bgColor}`"
  >
    <b-card
      overlay
      :img-src="require(`@/assets/images/products/${data.image}.svg`)"
      img-alt="Image"
    >
      <div class="card-title d-flex align-items-center">
        <h3 class="font-weight-bolder text-white">
          {{ data.name }}
        </h3>
      </div>
      <div class="card-content d-flex flex-column justify-content-between">
        <b-card-text>
          <span v-html="data.description" />&nbsp;
          <b-link
            v-if="data.landing_link || data.app_link"
            :href="data.landing_link || data.app_link"
            target="_blank"
          >
            Selengkapnya
          </b-link>
          <b-link
            v-else
            :href="storeURL"
            target="_blank"
          >
            Selengkapnya
          </b-link>
        </b-card-text>
        <div>
          <div class="d-flex justify-content-between">
            <b-button
              v-if="data.subscription || isAdmin"
              class="btn-fill"
              :disabled="data.disabled"
              :href="data.app_link"
            >
              Buka App
            </b-button>
            <b-button
              v-else
              class="btn-fill"
              :disabled="data.disabled"
              :href="storeURL"
            >
              Coba Gratis
            </b-button>

            <b-button
              class="btn-outline px-0"
              :href="storeURL"
              :disabled="data.disabled"
            >
              Berlangganan
            </b-button>
          </div>
          <div class="active-period mt-50">
            <span v-if="data.subscription && isValidStatus(data.subscription)">
              Aktif Periode : {{ formatDate(data.subscription.period_end, { year: 'numeric', month: 'long', day: 'numeric' }) }}
              <span v-if="data.subscription.group && data.subscription.group.name === 'trial'">
                (Free Trial)
              </span>
            </span>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import { BButton, BCard, BCardText, BLink } from 'bootstrap-vue'
import { isUserAdmin } from '@/auth/utils'
import { formatDate } from '@core/utils/filter'

export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    BButton,
    BCard,
    BCardText,
    BLink,
  },
  computed: {
    isAdmin() {
      return isUserAdmin()
    },
    storeURL() {
      return `${process.env.VUE_APP_WAS_SITE_URL}/#/store`
    }
  },
  setup() {
    const isValidStatus = subscirptionData => {
      if (!subscirptionData.status || subscirptionData.status === 'canceled' || subscirptionData.status === 'ended') return false
      return true
    }

    return {
      formatDate,
      isValidStatus,
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/vue/components/product-card';
</style>
