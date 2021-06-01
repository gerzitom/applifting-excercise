export default ({ $axios }) => {
  console.log('AXIOS')
  $axios.onRequest(() => {
    $axios.setHeader('X-API-KEY', '73988432-8a7d-4558-bb59-d27d4fabf2c6')
  })
}
