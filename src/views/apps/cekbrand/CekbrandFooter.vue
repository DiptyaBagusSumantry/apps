<template>
  <div class="pt-2 cekbrand-footer">
    <h3 class="font-weight-bolder d-block text-black mb-3">
      Coba layanan Widya Analytic lainnya!
    </h3>
    <div class="product-list mx-auto d-flex flex-wrap justify-content-center">
      <product-card
        v-for="(product, idx) in products"
        :key="idx"
        class="mx-1 mb-1"
        :data="product"
      />
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'

import ProductCard from './components/ProductCard.vue'
import store from '@/store'

export default {
  components: {
    ProductCard
  },
  setup() {
    const products = computed(() => store.getters['store/getProducts']())

    return {
      products,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';

.cekbrand-footer {
  h3 {
    text-align: center;
    @include media-breakpoint-up(xl) {
      text-align: left;
      padding-left: 120px;
    }
  }
  .product-list {
    max-width: 1200px;
  }
}
</style>
