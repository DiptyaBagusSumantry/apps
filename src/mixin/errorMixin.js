export default {
  methods: {
    notify(title, message, theme, time = 4000) {
      this.$vs.notify({
        time,
        title: `${title}`,
        text: message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: theme,
      })
    },
    notifyMessage(title, error, theme, notify) {
      const isObject = obj => (typeof obj === 'object'
                               && obj !== null
                               && !Array.isArray(obj))

      const notMessageKeys = ['code', 'token_class', 'token_type']

      if (isObject(error)) {
        // eslint-disable-next-line
        for (const key in error) {
          if (!notMessageKeys.includes(key)) this.notifyMessage(error[key])
        }
      } else if (Array.isArray(error)) {
        // Serialize error
        error.forEach(value => {
          this.notifyMessage(value)
        })
      } else notify(title, error, theme)
    },
    notifyError(title, error, theme, notify = this.notify) {
      const { data: errorData, status: errorStatusCode, statusText: errorStatus } = error.response

      /*
      Need to nofity internal server error,
      because axiox intercept did not push to under mainatenance page
      */
      if (errorStatusCode >= 500) {
        notify(title, 'Terjadi kesalahan pada sistem kami.', theme)
        return
      }

      if (errorData) {
        this.notifyMessage(errorData)
      } else notify(title, errorStatus, theme)
    },
  },
}
