<template>
  <div>
    <b-sidebar
      id="sidebar-voucher-handler"
      sidebar-class="sidebar-lg"
      :visible="isVoucherHandlerSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-voucher-handler-sidebar-active', val)"
      @hidden="clearForm"
    >
      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h4 class="mb-0">
            {{ voucherLocal.id ? 'Ubah' : 'Buat' }} Kupon
          </h4>

          <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
          />
        </div>

        <!-- Body -->
        <validation-observer
          #default="{ handleSubmit }"
          ref="refFormObserver"
        >

          <!-- Form -->
          <b-form
            class="p-2"
            @submit.prevent="handleSubmit(onSubmit)"
            @reset.prevent="resetForm"
          >

            <!-- Name -->
            <validation-provider
              #default="validationContext"
              name="Nama channel"
              vid="name"
              rules="required|alpha-spaces"
            >
              <b-form-group
                label="Nama Channel"
                label-for="voucher-name"
              >
                <b-form-input
                  id="voucher-name"
                  v-model="voucherLocal.name"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Code -->
            <validation-provider
              #default="validationContext"
              name="Kode kupon"
              vid="code"
              rules="required|alpha-dash|max:64"
            >
              <b-form-group
                label="Kode Kupon"
                label-for="voucher-code"
              >
                <b-form-input
                  id="voucher-code"
                  v-model="voucherLocal.code"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Form Actions -->
            <div class="d-flex mt-2">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-2"
                type="submit"
              >
                {{ voucherLocal.id ? 'Ubah' : 'Buat' }}
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
              >
                Reset
              </b-button>
            </div>
          </b-form>
        </validation-observer>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BAvatar, BButton, BFormInvalidFeedback,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, alphaDash, alphaSpaces , max } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import { toRefs } from '@vue/composition-api'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useVoucherHandler from './useVoucherHandler'
import useVouchersList from './useVouchersList'

export default {
  components: {
    // BSV
    BButton,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BAvatar,
    BFormInvalidFeedback,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isVoucherHandlerSidebarActive',
    event: 'update:is-voucher-handler-sidebar-active',
  },
  props: {
    isVoucherHandlerSidebarActive: {
      type: Boolean,
      required: true,
    },
    voucher: {
      type: Object,
      required: true,
    },
    clearVoucherData: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaDash,
      alphaSpaces,
      max,
    }
  },
  methods: {
    onSubmit() {
      const voucherData = JSON.parse(JSON.stringify(this.voucherLocal))

      // * If event has id => Edit Event
      // Emit event for add/update event
      if (this.voucher.id) {
        this.updateVoucher(voucherData)
          .then(() => {
            // Close sidebar
            this.$emit('update:is-voucher-handler-sidebar-active', false)

            // Refresh table
            this.$emit('refresh')
          })
          .catch(error => {
            if (error.response && error.response.data) {
              const { error: validationErrors } = error.response.data
              if (validationErrors) {
                this.$refs.refFormObserver.setErrors(validationErrors)
              } else {
                const errorData = error.response.data
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Error updating voucher',
                    icon: 'AlertCircleIcon',
                    variant: 'danger',
                    text: errorData.detail || errorData.message || errorData,
                  },
                })
              }
            }
          })
      }
      else {
        this.addVoucher(voucherData)
          .then(() => {
            // Close sidebar
            this.$emit('update:is-voucher-handler-sidebar-active', false)

            // Refresh table
            this.$emit('refresh')
          })
          .catch(error => {
            if (error.response && error.response.data) {
              const { error: validationErrors } = error.response.data
              if (validationErrors) {
                this.$refs.refFormObserver.setErrors(validationErrors)
              } else {
                const errorData = error.response.data
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Error creating voucher',
                    icon: 'AlertCircleIcon',
                    variant: 'danger',
                    text: errorData.detail || errorData.message || errorData,
                  },
                })
              }
            }
          })
      }
    }
  },
  setup(props) {
    const {
      voucherLocal,
      resetVoucherLocal,
    } = useVoucherHandler(toRefs(props))

    const {
      addVoucher,
      updateVoucher,
    } = useVouchersList()

    const {
      refFormObserver,
      getValidationState,
      resetForm,
      clearForm,
    } = formValidation(resetVoucherLocal, props.clearVoucherData)

    return {
      // Add New
      voucherLocal,
      addVoucher,

      // Update
      updateVoucher,

      // Form Validation
      resetForm,
      clearForm,
      refFormObserver,
      getValidationState,
    }
  },
}
</script>

<style lang="scss">
#sidebar-voucher-handler {
  min-width: 375px;
  height: 100%;
}
</style>
