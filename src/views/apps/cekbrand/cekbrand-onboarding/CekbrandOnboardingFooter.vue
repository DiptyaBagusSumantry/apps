<template>
  <div class="mt-lg-4">
    <b-button
      size="lg"
      variant="gradient-primary"
      @click="connectFacebook()"
    >
      Hubungkan ke Facebook
    </b-button>
  </div>
</template>

<script>
import { BButton} from 'bootstrap-vue'
import useCekbrand from '../useCekbrand'

export default {
  components: {
    BButton,
  },
  setup (props, context) {
    const {
      connectFacebook
    } = useCekbrand(props, context)

    return {
      connectFacebook,
    }
  }
}
</script>