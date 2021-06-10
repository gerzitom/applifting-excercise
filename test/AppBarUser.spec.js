import AppBarUser from '~/components/AppBarUser'
import { describe } from '@jest/globals'
import { mount } from '@vue/test-utils'
import User from '@/types/User'

const mountOptions = {
  mocks: {
    $auth: {
      loggedIn: false,
      user: new User(
        '23a10b02-7fcd-460a-995f-936e95edadea',
        '73988432-8a7d-4558-bb59-d27d4fabf2c6',
        'gerzitom',
        '2021-05-25T11:29:41.700676'
      ),
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

  test('If user is logged in, display user name and articles buttons', () => {
    console.log(mountOptions)
    mountOptions.mocks.$auth.loggedIn = true
    const wrapper = mount(AppBarUser, mountOptions)
    expect(wrapper.find('#my-articles-button').isVisible()).toBeTruthy()
    expect(wrapper.find('#new-article-button').isVisible()).toBeTruthy()
  })
})
