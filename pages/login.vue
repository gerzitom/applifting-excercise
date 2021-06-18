<template>
  <div class="login-page">
    <v-card max-width="400" class="pa-5 mx-auto mt-10">
      <h1 class="text-h2 mb-3 pb-5">Login</h1>
      <v-form onsubmit="return false" @submit="userLogin" ref="form">
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
          <v-text-field
            v-model="userId"
            label="User ID"
            data-test-id="user-id"
            :disabled="loading"
            :error="tenantIdError.isError"
            :error-messages="tenantIdError.messages"
            :rules="[userIdRequired]"
          />
          <v-text-field
            v-model="login.username"
            label="Username"
            :disabled="loading"
            :rules="[usernameRequired]"
            data-test-id="username"
          />
        </template>
        <v-text-field
          v-model="login.password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          :disabled="loading"
          name="input-10-1"
          label="Password"
          :error="passwordError.isError"
          :error-messages="passwordError.messages"
          :rules="[passwordRequired]"
          data-test-id="password"
          @click:append="show = !show"
        ></v-text-field>

        <v-btn
          class="primary mb-3 mt-5"
          width="100%"
          type="submit"
          :loading="loading"
          data-test-id="login_button"
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
import User from '~/types/User'
import { AxiosError } from 'axios'

@Component
export default class LoginPage extends Vue {
  login = new LoginData()
  userId = ''
  selectedUser: LocalUser | null = null
  show = false
  loading = false

  tenantIdError: ErrorData = new ErrorData()
  passwordError: ErrorData = new ErrorData()

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
    if (!this.validateInputs()) return
    this.resetErrors()
    this.loading = true
    if (this.selectedUser) {
      this.login.username = this.selectedUser.username
      this.userId = this.selectedUser.userId
    }
    try {
      const userInfo = await this.$store.dispatch(
        'user/getUserInfo',
        this.userId
      )
      await this.storeApikey(userInfo.apiKey)

      await this.$auth.loginWith('local', { data: this.login })
      await this.setAuthUser(userInfo)
      const user = new LocalUser(this.userId, this.login.username)
      this.saveUserLoginInfo(user)
      this.loading = false
    } catch (err) {
      let errorTitle = this.getErrorMessage(err)
      this.$nuxt.$emit('temporary-error', {
        message: errorTitle,
      })
      this.loading = false
    }
  }

  /**
   * Basic validation of form if every field is not empty
   */
  validateInputs(): boolean {
    ;(this.$refs.form as Vue & { validate: () => boolean }).validate()
    if (this.selectedUser && this.login.password !== '') return true
    else
      return (
        this.userId !== '' &&
        this.login.username !== '' &&
        this.login.password !== ''
      )
  }

  /**
   * Gets error message for global error snackbar
   * If error message supports multiple errors object,
   * add error messages right as input error messages to vuetify component.
   * For more info: https://vuetifyjs.com/en/api/v-text-field/#props-error
   */
  getErrorMessage(error: AxiosError): string {
    let errMessage = ''
    if (error.response && error.response.data) {
      const errorsObj = error.response.data.errors
      if (errorsObj) {
        for (const err in errorsObj) {
          if (err === 'tenantId') {
            this.tenantIdError.isError = true
            this.tenantIdError.messages = errorsObj[err]
          } else if (err === 'Password') {
            this.passwordError.isError = true
            this.passwordError.messages = errorsObj[err]
          }
        }
        if (error.response) errMessage = error.response.data.title
      } else {
        if (error.response) errMessage = error.response.data.message
      }
    }
    return errMessage
  }

  /**
   * Stores API key into local storage for axios plugin
   * Sets API key to axios for login call
   */
  async storeApikey(apiKey: string) {
    await this.$auth.$storage.setUniversal('apiKey', apiKey)
    this.$axios.defaults.headers.common['X-API-KEY'] = apiKey
    this.$axios.setHeader('X-API-KEY', apiKey)
  }

  /**
   * Sets user to auth plugin
   * Save user to local storage
   */
  async setAuthUser(userInfo: User) {
    this.$auth.setUser(userInfo)
    await this.$auth.$storage.setUniversal('user', userInfo)
  }

  /**
   * Save user ID and username to be used for future logins.
   * In future logins user do not have to type this credentials,
   * only choose right credentials
   * @param user to be added to local storage
   */
  saveUserLoginInfo(user: LocalUser) {
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

  resetErrors() {
    this.tenantIdError = new ErrorData()
    this.passwordError = new ErrorData()
  }

  //rules
  passwordRequired(value: any): any {
    return !!value || 'Password required.'
  }

  usernameRequired(value: any): any {
    return !!value || 'Username required.'
  }

  userIdRequired(value: any): any {
    return !!value || 'User ID required.'
  }
}

class ErrorData {
  isError: boolean = false
  messages: string[] = []
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
