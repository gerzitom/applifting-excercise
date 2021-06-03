import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import User from '~/types/User'

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true,
})
export default class UserStore extends VuexModule {
  private user!: User

  @Mutation
  setUser(user: User) {
    this.user = user
  }

  @Action({
    rawError: true,
  })
  async login() {}

  @Action({
    rawError: true,
  })
  async getUserInfo(userId: number) {
    const userInfo = await $axios.get<User>(`/tenants/${userId}`)
    this.context.commit('setUser', userInfo.data)
    return userInfo.data
  }
}