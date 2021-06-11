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

    <v-snackbar v-model="globalError.show" :timeout="-1" color="error">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="mr-4">mdi-alert-circle</v-icon>
          <div>
            <p v-if="globalError.title" class="font-weight-bold text-h6 my-1">
              {{ globalError.title }}
            </p>
            <p class="my-1">{{ globalError.message }}</p>
          </div>
        </div>
        <v-btn text @click="globalError.show = false"> Close </v-btn>
      </div>
    </v-snackbar>

    <v-snackbar
      v-model="globalTemporaryError.show"
      :timeout="5000"
      color="error"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-4">mdi-alert-circle</v-icon>
        <div>
          <p v-if="globalTemporaryError.title" class="font-weight-bold my-1">
            {{ globalTemporaryError.title }}
          </p>
          <p class="my-1">{{ globalTemporaryError.message }}</p>
        </div>
      </div>
    </v-snackbar>

    <v-snackbar v-model="globalInfo.show" :timeout="5000">
      <div class="d-flex align-center">
        <!--        <v-icon class="mr-4">mdi-alert-circle</v-icon>-->
        <div>
          <p v-if="globalInfo.title" class="font-weight-bold my-1">
            {{ globalInfo.title }}
          </p>
          <p class="my-1">{{ globalInfo.message }}</p>
        </div>
      </div>
    </v-snackbar>
  </v-app>
</template>

<script>
import WebsocketMessage from '@/types/WebsocketMessage'

export default {
  components: {
    AppBarUser: () => import('~/components/AppBarUser'),
  },
  middleware: 'axiosApiToken',
  data() {
    return {
      globalError: {
        title: '',
        message: '',
        show: false,
      },
      globalTemporaryError: {
        title: '',
        message: '',
        show: false,
      },
      globalInfo: {
        title: '',
        message: '',
        show: false,
      },
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
  mounted() {
    const socket = new WebSocket('ws://fullstack.exercise.applifting.cz')

    // Connection opened
    socket.addEventListener('open', function (event) {
      socket.send('Hello Server!')
    })

    // Listen for messages
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      console.log(this)
      this.resolveWebsocketMessage(message)
    })

    this.$nuxt.$on('error', (error) => {
      this.globalError.title = error.title
      this.globalError.message = error.message
      this.globalError.show = true
    })

    this.$nuxt.$on('temporary-error', (error) => {
      this.globalTemporaryError.title = error.title
      this.globalTemporaryError.message = error.message
      this.globalTemporaryError.show = true
    })

    this.$nuxt.$on('info', (error) => {
      this.globalInfo.title = error.title
      this.globalInfo.message = error.message
      this.globalInfo.show = true
    })
  },
  methods: {
    resolveWebsocketMessage(message) {
      switch (message.changeType) {
        case 'commentCreated':
          this.$store.commit('articles/addCommentMutation', message.comment)
      }
    },
  },
}
</script>
