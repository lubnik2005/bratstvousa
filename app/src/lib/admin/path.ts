
const admin_paths = {
    church: {
      list: '/resources/churches',
      one: (id: string) => `/resources/churches/${id}`
    },
    form_submission: {
      list: '/resources/form-submissions',
      one: (id: string) => `/resources/form-submissions/${id}`
    }
}
