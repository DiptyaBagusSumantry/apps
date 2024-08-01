import { ref, watch } from '@vue/composition-api'

export default function useAddNewInvoice(props, emit) {
  // ------------------------------------------------
  // invoiceLocal
  // ------------------------------------------------
  const invoiceLocal = ref(JSON.parse(JSON.stringify(props.invoice.value)))
  const resetInvoiceLocal = () => {
    invoiceLocal.value = JSON.parse(JSON.stringify(props.invoice.value))
  }
  watch(props.invoice, () => {
    resetInvoiceLocal()
  })

  const onSubmit = () => {
    const invoiceData = JSON.parse(JSON.stringify(invoiceLocal))

    emit('add-invoice', invoiceData.value)
  }

  return {
    invoiceLocal,
    resetInvoiceLocal,

    onSubmit,
  }
}
