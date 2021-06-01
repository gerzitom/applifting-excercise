<template>
  <div class="login-page">
    <v-card max-width="400" class="pa-5 mx-auto mt-10">
      <h1 class="text-h2 mb-3">Login</h1>
      <v-form onsubmit="return false" @submit="userLogin">
        <v-text-field
          v-model="login.username"
          label="Username"
          :disabled="loading"
        />
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

<script>
export default {
  name: 'login',
  data() {
    return {
      login: {
        username: 'gerzitom',
        password: 'haha',
      },
      show: false,
      loading: false,
    }
  },
  methods: {
    userLogin() {
      this.loading = true
      this.$auth
        .loginWith('local', { data: this.login })
        // .then((response) => {
        //   console.log(response)
        // })
        .catch((error) => {
          console.log(error)
          // this.alertText = error.response.data.message
          // this.error.username = true
          // this.error.password = true
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped></style>
