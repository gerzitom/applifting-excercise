export default ({ $axios, $auth }) => {
  $axios.onRequest(() => {
    if ($auth) {
      const apiKey = $auth.$storage.getUniversal('apiKey')
      $axios.setHeader('X-API-KEY', apiKey)
      if (!$auth.user || !$auth.user.tenantId) {
        $auth.setUser($auth.$storage.getUniversal('user'))
      }
    }
  })
}
