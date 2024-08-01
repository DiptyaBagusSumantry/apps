<template>
  <b-card
    no-body
    class="mb-0"
  >
    <b-card-header class="pb-50">
      <h5>
        Filters
      </h5>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Subscription</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="subscriptionFilter"
            :options="subscriptionOptions"
            class="w-100 text-capitalize"
            label="name"
            :reduce="val => val.name"
            @input="(val) => $emit('update:subscriptionFilter', val)"
          />
        </b-col>
        <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Status</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="subscriptionStatusFilter"
            :options="subscriptionStatusOptions"
            class="w-100"
            :reduce="val => val.value"
            @input="(val) => $emit('update:subscriptionStatusFilter', val)"
          />
        </b-col>
        <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Kategori</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="categoryFilter"
            :options="categoryOptions"
            label="name"
            class="w-100"
            :reduce="val => val.id"
            @input="(val) => $emit('update:categoryFilter', val)"
          />
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BRow, BCol,
} from 'bootstrap-vue'
import vSelect from 'vue-select'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    vSelect,
  },
  props: {
    subscriptionFilter: {
      type: [String, null],
      default: null,
    },
    subscriptionStatusFilter: {
      type: [String, null],
      default: null,
    },
    categoryFilter: {
      type: [String, Number, null],
      default: null,
    },
    subscriptionOptions: {
      type: Array,
      required: true,
    },
    subscriptionStatusOptions: {
      type: Array,
      required: true,
    },
    categoryOptions: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
