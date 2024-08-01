<template>
  <b-sidebar
    id="add-new-invoice-sidebar"
    :visible="isAddNewInvoiceSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:is-add-new-invoice-sidebar-active', val)"
    @hidden="resetForm"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="content-sidebar-header px-2 py-1">
        <div class="d-flex justify-content-between align-items-center">
          <h4>
            Buat Invoice Baru
          </h4>

          <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
          />

        </div>

        <span class="font-small-3 mr-2">Kamu akan membuat invoice pemesanan subscription untuk {{ title(`${invoiceLocal.first_name} ${invoiceLocal.last_name}`.trim()) }}</span>
      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >

        <!-- Form -->
        <b-form
          class="p-2 text-reset"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >

          <!-- Subscription -->
          <validation-provider
            #default="validationContext"
            name="Subscription"
            rules="required"
          >
            <b-form-group
              label="Subscription"
              label-for="subscription"
              :state="getValidationState(validationContext)"
            >
              <v-select
                class="text-capitalize"
                v-model="invoiceLocal.subscription.group"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="name"
                :clearable="false"
                :options="subscriptionOptions"
                input-id="subscription"
              />

              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Subscription Duration -->
          <validation-provider
            #default="validationContext"
            name="Durasi subscription"
            rules="required"
          >
            <b-form-group
              label="Durasi Subscription"
              label-for="subscription-period"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="invoiceLocal.subscription.plan"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="name"
                :clearable="false"
                :options="subscriptionPeriodOptions"
                input-id="subscription-period"
              />

              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Subscription Period Start -->
          <validation-provider
            #default="validationContext"
            name="Subscription mulai"
            rules="required"
          >
            <b-form-group
              label="Subscription Mulai"
              label-for="subscription-start"
              :state="getValidationState(validationContext)"
            >
              <b-form-datepicker
                input-id="subscription-start"
                v-model="invoiceLocal.subscription.period_start"
                locale="id-ID"
                value-as-date
                :disabled="isDatePickerDisabled"
                :min="new Date()"
                :class="validationContext.errors.length > 0 ? 'is-invalid' : null"
              />

              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Subscription Period End -->
          <validation-provider
            #default="validationContext"
            name="Subscription selesai"
            rules="required"
          >
            <b-form-group
              label="Subscription Selesai"
              label-for="subscription-end"
              :state="getValidationState(validationContext)"
            >
              <b-form-datepicker
                input-id="subscription-end"
                v-model="invoiceLocal.subscription.period_end"
                locale="id-ID"
                value-as-date
                :disabled="isDatePickerDisabled"
                :class="validationContext.errors.length > 0 ? 'is-invalid' : null"
              />

              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Subscription Price -->
          <validation-provider
            #default="validationContext"
            name="Harga"
            :rules="{ regex: /^([0-9]|\+?[1-9]+[0-9]+)$/, required: true }"
          >
            <b-form-group
              label="Harga Subscription"
              label-for="subscription-price"
              :state="getValidationState(validationContext)"
            >
             <b-input-group
                input-id="subscription-price"
                type="number"
                prepend="Rp."
                class="input-group-merge"
                :class="validationContext.errors.length > 0 ? 'is-invalid' : null"
              >
                <b-form-input
                  v-model="invoiceLocal.price"
                  :class="validationContext.errors.length > 0 ? 'is-invalid' : null"
                />
              </b-input-group>

              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Subscription Tax -->
          <validation-provider
            #default="validationContext"
            name="Pajak"
            :rules="{ required: true }"
          >
            <b-form-group label="Pajak" label-for="subscription-tax">
              <b-input-group
                input-id="subscription-tax"
                append="%"
                class="input-group-merge"
                :class="validationContext.errors.length > 0 ? 'is-invalid' : null"
              >
                <b-form-input
                  type="number"
                  step="0.01"
                  v-model="invoiceLocal.tax_aggregate"
                  :class="validationContext.errors.length > 0 ? 'is-invalid' : null"
                />
              </b-input-group>

              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <b-form-group label="Harga Dibayarkan">
            <b-input-group prepend="Rp." class="input-group-merge">
              <b-form-input type="number" v-model="invoiceLocal.price_paid" disabled class="bg-white" />
            </b-input-group>
          </b-form-group>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Simpan
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Batalkan
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BFormDatepicker, BInputGroup, BButton,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { toRefs, watch } from '@vue/composition-api'
import { required, alphaNum } from '@validations'
import { title } from '@core/utils/filter'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import _ from 'lodash'
import useAddNewInvoice from './useAddNewInvoice'

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormDatepicker,
    BInputGroup,
    BButton,
    flatPickr,
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewInvoiceSidebarActive',
    event: 'update:is-add-new-invoice-sidebar-active',
  },
  props: {
    isAddNewInvoiceSidebarActive: {
      type: Boolean,
      required: true,
    },
    subscriptionOptions: {
      type: Array,
      required: true,
    },
    subscriptionPeriodOptions: {
      type: Array,
      required: true,
    },
    invoice: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
    }
  },
  computed: {
    isDatePickerDisabled() {
      return Boolean(this.invoiceLocal.subscription.plan && this.invoiceLocal.subscription.plan.period_days !== null)
    }
  },
  setup(props, { emit }) {
    const {
      invoiceLocal,
      resetInvoiceLocal,

      onSubmit,
    } = useAddNewInvoice(toRefs(props), emit)

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetInvoiceLocal)

    watch(() => _.cloneDeep(invoiceLocal.value.subscription.plan), currentPlan => {
      // Set period based selected plan
      if (currentPlan) {
        const now = new Date()

        // Set period end only if selected option is not custom duration
        if (currentPlan.period_days) {
          invoiceLocal.value.subscription.period_start = now
          invoiceLocal.value.subscription.period_end = new Date(now
            .fp_incr(currentPlan.period_days - 1)
          )
        }

        // Set default price paid according plan price
        const { group } = invoiceLocal.value.subscription
        if (group && group.name === 'trial') {
          invoiceLocal.value.price = 0
        } else {
          invoiceLocal.value.price = invoiceLocal.value.subscription.plan.price
        }
      }
    })
    watch(() => _.cloneDeep(invoiceLocal.value.subscription.group), currentGroup => {
      // Set default price paid according plan price
      if (currentGroup && currentGroup.name === 'trial') {
        invoiceLocal.value.price = 0
      } else if (invoiceLocal.value.subscription.plan) {
        invoiceLocal.value.price = invoiceLocal.value.subscription.plan.price
      } else invoiceLocal.value.price = null
    })
    watch(() => _.cloneDeep(invoiceLocal.value.subscription.group), currentGroup => {
      // Set default price paid according plan price
      if (currentGroup && currentGroup.name === 'trial') {
        invoiceLocal.value.price = 0
      } else if (invoiceLocal.value.subscription.plan) {
        invoiceLocal.value.price = invoiceLocal.value.subscription.plan.price
      } else invoiceLocal.value.price = null
    })
    watch(() => _.cloneDeep(invoiceLocal.value.price), currentPrice => {
      let tax_aggregate = 0.11
      if (currentPrice > 2000000) {
        tax_aggregate = 0.125
      }
      invoiceLocal.value.tax_aggregate = tax_aggregate
    })
    watch(() => _.cloneDeep(invoiceLocal.value.price), currentPrice => {
      const taxAmount = currentPrice * invoiceLocal.value.tax_aggregate
      invoiceLocal.value.price_paid = Number(currentPrice) + taxAmount
    })
    watch(() => _.cloneDeep(invoiceLocal.value.tax_aggregate), currentTaxAggregate => {
      const taxAmount = invoiceLocal.value.price * currentTaxAggregate
      invoiceLocal.value.price_paid = invoiceLocal.value.price + taxAmount
    })


    return {
      invoiceLocal,
      onSubmit,

      // UI
      title,

      // Form Validation
      refFormObserver,
      getValidationState,
      resetForm,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-invoice-sidebar {
  min-width: 375px;
  height: 100%;

  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/_variables.scss';

form ::v-deep {

  // Mail To vue-select style
  .v-select {

    .vs__open-indicator {
      color: $body-color;
    }
  }
}

</style>
