<template>
  <b-card
    v-if="data"
    class="select-account-card"
    no-body
  >
    <div
      v-if="connected || used"
      class="badge text-white"
      :class="{
        'bg-gray': used,
        'bg-primary':  connected,
      }"
    >
      <span>
        {{ connected ? 'Sudah Terhubung' : 'Terhubung ke Toba lain' }}
      </span>
    </div>
    <div class="d-flex h-100 flex-column align-items-center justify-content-around">
      <b-avatar
        :src="data.profile_picture_url"
        size="60px"
      >
        <template #badge>
          <b-img
            :src="require('@/assets/images/icons/instagram.svg')"
            width="24px"
            height="24px"
          />
        </template>
      </b-avatar>
      <div class="text-center">
        <p class="font-weight-bolder text-dark m-0">
          {{ data.name }}
        </p>
        <span>
          @{{ data.username }}
        </span>
      </div>
      <div v-if="!connected && !used">
        <slot name="selectAccount" />
      </div>
      <b-button
        v-if="connected"
        class="w-100"
        variant="outline-danger"
        @click="$emit('disconnect', data)"
      >
        Lepas Koneksi
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { BAvatar, BButton, BCard, BFormCheckbox, BImg } from 'bootstrap-vue'

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    connected: {
      type: Boolean,
      default: false,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BAvatar,
    BButton,
    BCard,
    BFormCheckbox,
    BImg,
  },
}
</script>

<style lang="scss">
.select-account-card {
  padding: 30px 15px 20px 15px;
  border-radius: 6px;
  height: 232px;
  width: 193px;

  &.card {
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05) !important;
    position: relative;
  }
  &.selected {
    background: #f8fbfe;
    border: 3px solid #368ac8;
    border-bottom: 3px solid #368ac8 !important;
    border-top: 3px solid #368ac8 !important;
    border-radius: 5px;
  }
  & > .badge {
    position: absolute;
    width: fit-content;
    height: 25px;
    top: 0;
    left: 0;
    border-radius: 6px 0px;

    &.bg-gray {
      background: #c9cbcd;
    }
    span {
      font-size: 10px;
      line-height: 150%;
    }
  }
}
</style>
