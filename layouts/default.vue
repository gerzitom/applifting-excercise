<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <app-bar-user />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <v-snackbar v-model="showGlobalError" :timeout="-1" color="error">
      <div class="d-flex align-center">
        <v-icon class="mr-4">mdi-alert-circle</v-icon>
        <div>
          <p class="font-weight-bold my-1">{{ globalError.title }}</p>
          <p class="my-1">{{ globalError.message }}</p>
        </div>
      </div>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  components: {
    AppBarUser: () => import('~/components/AppBarUser'),
  },
  data() {
    return {
      globalError: {
        title: '',
        message: '',
      },
      showGlobalError: false,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      title: 'Vuetify.js',
    }
  },
  created() {
    this.$nuxt.$on('error', (error) => {
      this.showGlobalError = true
      this.globalError.title = error.title
      this.globalError.message = error.message
    })
  },
}
</script>
