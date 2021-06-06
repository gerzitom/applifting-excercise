import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import Article from '~/types/Article'
import ArticleDetail from '~/types/ArticleDetail'
import { store } from '@/store'
import NewCommentDto from '~/types/NewCommentDto'
import Comment from '~/types/Comment'

@Module({
  name: 'pictures',
  dynamic: true,
  store: store,
})
export default class Pictures extends VuexModule {
  /**
   * Uploads image and returns new image ID
   * @param formData including new image
   */
  @Action({
    rawError: true,
  })
  async uploadPicture(formData: FormData): Promise<string> {
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
          console.log(err)
        })
    })
  }
}
