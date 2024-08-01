<template>
  <div>
    <div class="account-img-container flex flex-col items-center justify-center mb-base w-full">

      <vx-card class="account-img mb-4" :class="{ 'account-img--disabled': account.connected, 'border-solid border-primary': isChecked }">
        <div slot="no-body" class="py-base">

          <!-- SLOT: ACTION SECTION -->
          <slot name="label-section" />

          <div>
            <div class="bg-white flex items-center justify-center">
              <img :src="account.profile_picture_url" :alt="account.username" class="rounded-full w-12 h-12 shadow-md">
            </div>
            <div class="account-img__content flex flex-col items-center justify-center mt-4">
              <span
                class="account-img__content__name"
                :class="account.name ? 'text-black' : 'text-white'">
                {{ account.name ? account.name : account.username }}
              </span>
              <span class="account-img__content__username text-grey mt-1">@{{ account.username }}</span>
            </div>
          </div>
        </div>
      </vx-card>

      <!-- SLOT: ACTION SECTION -->
      <div class="flex flex-col items-center justify-center text-center w-full">
        <slot name="action-section" />
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
      required: true
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  }
}

</script>

<style lang="scss" scoped>
@import "@/assets/scss/vuexy/apps/cekbrand-callback.scss";
</style>
