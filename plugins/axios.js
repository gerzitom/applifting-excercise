export default ({ $axios, $auth }) => {
  if ($auth) {
    const apiKey = $auth.$storage.getUniversal('apiKey')
    $axios.onRequest(() => {
      $axios.setHeader('X-API-KEY', apiKey)
      // $axios.setHeader('X-API-KEY', '73988432-8a7d-4558-bb59-d27d4fabf2c6')
    })
  }
}
