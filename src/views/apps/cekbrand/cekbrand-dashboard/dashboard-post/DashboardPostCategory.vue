<template>
  <b-card
    no-body
    class="mb-0"
  >
    <b-card-header class="pb-1">
      <h3 class="font-weight-bolder text-black text-nowrap mb-0 mr-1">{{ title }}</h3>
      <b-card-text class="font-small-3 ml-sm-auto mt-25">
        {{ resolveDateRange() }}
      </b-card-text>
    </b-card-header>
    <b-card-body class="grid-view">
      <slot name="grid-view-items" />
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardHeader, BCardBody, BCardText } from 'bootstrap-vue'

import useDateFilter from '../components/useDateFilter'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BCardText,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const {
      // UI
      resolveDateRange,
    } = useDateFilter()

    return {
      // UI
      resolveDateRange,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';

// Grid View Specific style
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, 215px);
  column-gap: 1rem;
  justify-content: center;
  padding-bottom: 0.5rem;
}
</style>
