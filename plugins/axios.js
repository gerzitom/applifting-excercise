export default ({ $axios }) => {
  console.log('AXIOS')
  $axios.onRequest(() => {
    // $axios.setHeader('X-API-KEY', '0e44cc0e-4d90-40c2-a059-0e25e8effbe1')
    // $axios.setHeader('X-API-KEY', '73988432-8a7d-4558-bb59-d27d4fabf2c6')
  })
}
