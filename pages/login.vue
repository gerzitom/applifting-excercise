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
          <v-text-field
            v-model="xApiKey"
            label="Apie key"
            :disabled="loading"
          />
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
import LocalUser from '@/types/LocalUser'

export default {
  name: 'login',
  data() {
    return {
      login: {
        username: 'gerzitom',
        password: 'haha',
      },
      xApiKey: '',
      selectedUser: null,
      show: false,
      loading: false,
      selectedUser: null,
    }
  },
  computed: {
    availableUsers() {
      const users: LocalUser[] = this.$auth.$storage.getLocalStorage('users')
      const ret = [
        {
          user: 'No user',
          value: null,
        },
      ]
      if (users) {
        users.forEach((value, index) => {
          ret.push({
            user: value.username,
            value: value,
          })
        })
      }
      return ret
    },
  },
  methods: {
    userLogin() {
      this.loading = true
      if (this.selectedUser) {
        if (this.selectedUser.value !== null) {
          this.login.username = this.selectedUser.username
          this.xApiKey = this.selectedUser.apiKey
        }
      }
      this.$axios.defaults.headers.common['X-API-KEY'] = this.xApiKey
      this.$auth
        .loginWith('local', { data: this.login })
        .then((response) => {
          const user = new LocalUser(this.xApiKey, this.login.username)
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
    },
    addUserToLocalStorage(user: LocalUser) {
      let users: LocalUser[] = this.$auth.$storage.getLocalStorage('users')
      if (!users) {
        users = []
      }
      const similarUser: LocalUser = users.find(
        (storedUser) => storedUser.username === user.username
      )
      if (!similarUser) {
        users.push(user)
        this.$auth.$storage.setLocalStorage('users', users)
      }
    },
  },
}
</script>

<style scoped></style>
