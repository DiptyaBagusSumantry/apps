import { computed, ref } from '@vue/composition-api'
import { formatDate } from '@core/utils/filter'
import { useRouter } from '@core/utils/utils'
import 'vue-flatpickr-component'
import store from '@/store'

export default function useDownloadData() {
  const { router } = useRouter()

  // Reference
  const refDownloadModal = ref(null)
  const refDownloadDemoModal = ref(null)
  const refDownloadLoadingModal = ref(null)
  const refDownloadErrorModal = ref(null)

  const fileExtensions = ['csv', 'pdf', 'xlsx']
  const fileTypes = [
    {
      label: 'Media',
      fileName: 'Data Performa Konten',
      value: 'media',
    },
    {
      label: 'Negara',
      fileName: 'Data Negara Asal Followers',
      value: 'country',
      info: 'Info: Jumlah followers semua negara bisa jadi tidak sama dengan angka followers saat ini karena tidak semua followers membuka informasi negara asalnya',
    },
    {
      label: 'Profil',
      fileName: 'Data Performa Akun',
      value: 'profile',
    },
    {
      label: 'Jenis Kelamin',
      fileName: 'Data Gender Followers',
      value: 'gender',
      info: 'Info: Jumlah followers semua gender bisa jadi tidak sama dengan angka followers saat ini karena tidak semua followers membuka informasi gendernya',
    },
    {
      label: 'Kota',
      fileName: 'Data Kota Asal Followers',
      value: 'city',
      info: 'Info: Jumlah followers semua kota bisa jadi tidak sama dengan angka followers saat ini karena tidak semua follower membuka informasi kota asalnya',
    },
    {
      label: 'Umur',
      fileName: 'Data Umur Followers',
      value: 'age',
      info: 'Info: Jumlah followers semua kelompok umur bisa jadi tidak sama dengan angka followers saat ini karena tidak semua followers membuka informasi umurnya',
    },
  ]
  const pageTypes = [
    {
      id: 1,
      label: 'Kompetitor',
      fileName: 'Kompetitor',
      value: 'kompetitor',
    },
    {
      id: 2,
      label: 'Statistik',
      fileName: 'Statistik',
      value: 'statistik',
    },
    {
      id: 3,
      label: 'Top Post',
      fileName: 'Top Post',
      value: 'top post',
    },
  ]
  const selectedFileExtension = ref('')
  const selectedFileName = ref('')
  const selectedFileType = ref('')

  // Computed
  const dateFilter = computed(() => store.state.cekbrand.dateFilter)
  const dataFrameOptions = computed(() => store.state.cekbrand.dataFrameOptions)
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])

  // Methods
  const resolveFileName = (fileName = null) => {
    let endDate = new Date() // today
    let startDate = endDate.fp_incr(-6)
    if (dataFrameOptions.value.includes(dateFilter.value)) {
      endDate = new Date() // today
      startDate = endDate.fp_incr(-(Number(dateFilter.value) - 1))
    } else {
      // Rate range
      ([startDate, endDate] = dateFilter.value.map(date => new Date(date)))
    }

    const format = { year: 'numeric', month: 'long', day: '2-digit' }
    const start = formatDate(startDate, format)
    const end = formatDate(endDate, format)
    let dateRangeDisplay = end
    if (startDate !== endDate) dateRangeDisplay = `${start} - ${end}`

    if (selectedFileExtension.value === 'csv') {
      return `${fileName} Tanggal ${dateRangeDisplay}`
    }
    return `Data @${activeAccountData.value.username} Tanggal ${dateRangeDisplay}`
  }

  /**
   * This function is used for download user account data
   * @param {Object} type file/page type, object shound contain `fileName` key
   */
  const downloadData = (type = null) => {
    refDownloadLoadingModal.value.show()
    refDownloadModal.value.hide()
    refDownloadErrorModal.value.hide()

    selectedFileType.value = type !== null ? type.value : selectedFileType.value
    selectedFileName.value = type !== null ? type.fileName : selectedFileName.value

    if (selectedFileExtension.value === 'pdf') {
      localStorage.setItem('dateFilter', JSON.stringify(dateFilter.value))
      const selectPages = type.map(page => page.id)
      const { href } = router.resolve({
        name: 'cekbrand-download',
        params: {
          username: activeAccountData.value.username,
          page: selectPages.join(','),
        },
      })
      window.open(href)
      return
    }

    store.dispatch('cekbrand/downloadActiveAccountData', {
      fileName: resolveFileName(selectedFileName.value),
      fileExtension: selectedFileExtension.value,
      fileType: selectedFileType.value,
    })
      .then(() => {
        selectedFileName.value = ''
        selectedFileType.value = ''
      })
      .catch(() => refDownloadErrorModal.value.show())
      .finally(() => refDownloadLoadingModal.value.hide())
  }

  const selectFileExtension = extension => {
    selectedFileExtension.value = extension
    if (extension === 'xlsx') {
      downloadData()
      return
    }

    refDownloadModal.value.show()
  }

  return {
    // Refs
    refDownloadModal,
    refDownloadDemoModal,
    refDownloadLoadingModal,
    refDownloadErrorModal,

    fileTypes,
    pageTypes,
    fileExtensions,
    selectedFileExtension,

    // Methods
    downloadData,
    selectFileExtension,
  }
}
