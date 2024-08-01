<template>
<div>
  <b-link
    class="text-reset"
    :to="{ path: '/' }"
  >
    <div class="d-flex justify-content-left">
      <b-img
        class="mr-50"
        :src="require('@/assets/images/icons/small-arrow-left.svg')"
      />
      <span> Kembali ke Pilih Akun </span>
    </div>
  </b-link>

  <div
    class="text-dark mb-lg-2 mt-4"
    style="font-size: 18px"
  >
    <center>
      <div
        class="font-weight-bolder mb-1 title"
        >
          Hai, {{ userData.firstName }}! 👋
      </div>
      <span> Pastikan kamu mengikuti setiap langkah-langkahnya dengan benar, ya! 💪 </span>
    </center>
  </div>
</div>
</template>

<script>
import { BLink, BImg } from 'bootstrap-vue'
import { getUserData } from '@/auth/utils'
import { computed } from '@vue/composition-api'

export default {
  components: {
    BLink,
    BImg,
  },
  setup() {
    const userData = computed(() => getUserData())
    return {
      userData
    }
  },
}
</script>