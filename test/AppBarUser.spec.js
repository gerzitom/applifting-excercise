import AppBarUser from '~/components/AppBarUser'
import { describe } from '@jest/globals'
import { mount } from '@vue/test-utils'

const mountOptions = {
  mocks: {
    $auth: {
      loggedIn: false,
    },
  },
  stubs: {
    NuxtLink: true,
    RouterLink: true,
    // Any other component that you want stubbed
  },
}

describe('App bar user', () => {
  test('If user is not logged in, display login button', () => {
    const wrapper = mount(AppBarUser, mountOptions)
    expect(wrapper.find('.logout-button').isVisible()).toBe(true)
  })
})
