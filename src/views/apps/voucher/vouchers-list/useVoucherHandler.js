import { ref, watch } from '@vue/composition-api'

export default function useVoucherHandler(props) {
  // ------------------------------------------------
  // voucherLocal
  // ------------------------------------------------
  const voucherLocal = ref(JSON.parse(JSON.stringify(props.voucher.value)))
  const resetVoucherLocal = () => {
    voucherLocal.value = JSON.parse(JSON.stringify(props.voucher.value))
  }
  watch(props.voucher, () => {
    resetVoucherLocal()
  })

  return {
    voucherLocal,
    resetVoucherLocal,
  }
}
