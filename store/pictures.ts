import { Action, Module, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { store } from '@/store'

@Module({
  name: 'pictures',
  dynamic: true,
  store: store,
})
export default class Pictures extends VuexModule {
  /**
   * Uploads image and returns new image ID
   * @param picture File to be uploaded
   */
  @Action({
    rawError: true,
  })
  async uploadPicture(picture: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', picture)
    interface Response {
      imageId: string
      name: string
    }
    return new Promise<string>((resolve, reject) => {
      $axios
        .post<Response[]>('/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          resolve(response.data[0].imageId)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Gets image by id
   * @param imageId
   * @return url to be used in <img/> tag
   */
  @Action({
    rawError: true,
  })
  public getImage(imageId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      $axios
        .get(`/images/${imageId}`, { responseType: 'arraybuffer' })
        .then((response) => {
          let blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          resolve(URL.createObjectURL(blob))
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
