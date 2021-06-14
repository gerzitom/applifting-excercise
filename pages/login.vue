<template>
  <div class="login-page">
    <v-card max-width="400" class="pa-5 mx-auto mt-10">
      <h1 class="text-h2 mb-3">Login</h1>
      <v-form onsubmit="return false" @submit="userLogin">
        <v-select
          v-model="selectedUser"
          :items="availableUsers"
          item-text="user"
          item-value="value"
          label="Select user"
          single-line
          outlined
        ></v-select>
        <template v-if="!selectedUser">
          <v-text-field v-model="userId" label="User ID" :disabled="loading" />
          <v-text-field
            v-model="login.username"
            label="Username"
            :disabled="loading"
          />
        </template>
        <v-text-field
          v-model="login.password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          :disabled="loading"
          name="input-10-1"
          label="Password"
          @click:append="show = !show"
        ></v-text-field>

        <v-btn
          class="primary mb-3 mt-5"
          width="100%"
          type="submit"
          :loading="loading"
        >
          Login
        </v-btn>
        <v-btn class="secondary" width="100%">Register</v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import LocalUser from '@/types/LocalUser'

@Component
export default class LoginPage extends Vue {
  login = new LoginData()
  userId = ''
  selectedUser: LocalUser | null = null
  show = false
  loading = false

  /**
   * Getting available users from local storage.
   * This must be done because API can not link api key and username
   */
  get availableUsers() {
    const users: LocalUser[] = this.$auth.$storage.getLocalStorage(
      'users'
    ) as LocalUser[]
    const ret: SelectData[] = []
    if (users) {
      users.forEach((value) => {
        ret.push(new SelectData(value.username, value))
      })
    }
    return ret
  }

  /**
   * Firstly check if user is selected from available users
   * or if new is added.
   * Then send API request to login user.
   * If user is logged in, new user is added to local storage to keep for other logins.
   * Global error is dispatched, if API request failed
   */
  async userLogin() {
    this.loading = true
    if (this.selectedUser) {
      this.login.username = this.selectedUser.username
      this.userId = this.selectedUser.userId
    }
    // TODO Bug after refreshing page
    const userInfo = await this.$store.dispatch('user/getUserInfo', this.userId)
    await this.$auth.$storage.setUniversal('apiKey', userInfo.apiKey)
    this.$axios.defaults.headers.common['X-API-KEY'] = userInfo.apiKey
    this.$axios.setHeader('X-API-KEY', userInfo.apiKey)
    this.$auth
      .loginWith('local', { data: this.login })
      .then(() => {
        const user = new LocalUser(this.userId, this.login.username)
        this.$auth.setUser(userInfo)
        this.$auth.$storage.setUniversal('user', userInfo)
        this.addUserToLocalStorage(user)
      })
      .catch((err) => {
        this.$nuxt.$emit('error', {
          title: 'API error',
          message: err.message,
        })
      })
      .finally(() => {
        this.loading = false
      })
  }

  /**
   * Adds user and api key to local storage
   * @param user to be added to local storage
   */
  addUserToLocalStorage(user: LocalUser) {
    let users = this.$auth.$storage.getLocalStorage('users') as LocalUser[]
    if (!users) {
      users = []
    }
    const similarUser = users.find(
      (storedUser) => storedUser.username === user.username
    )
    if (!similarUser) {
      users.push(user)
      this.$auth.$storage.setLocalStorage('users', users)
    }
  }
}

/**
 * Data structure for login
 */
class LoginData {
  username: string = ''
  password: string = ''
}

/**
 * Data structure for vuetify select
 */
class SelectData {
  user: string
  value: LocalUser

  constructor(user: string, value: LocalUser) {
    this.user = user
    this.value = value
  }
}
</script>

<style scoped></style>
