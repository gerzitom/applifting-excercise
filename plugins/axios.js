export default ({ $axios, $auth }) => {
  $axios.onRequest(() => {
    if ($auth) {
      const apiKey = $auth.$storage.getUniversal('apiKey')
      $axios.setHeader('X-API-KEY', apiKey)
      if (!$auth.user.tenantId) {
        const userInfo = $auth.$storage.getUniversal('user')
        $auth.setUser(userInfo)
      }
    }
  })
}
