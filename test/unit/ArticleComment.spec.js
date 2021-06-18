import { beforeEach, describe, jest } from '@jest/globals'
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import ArticleComment from '~/components/ArticleComment'
import Vuex from 'vuex'

const actions = {
  voteComment: jest.fn(),
  actionInput: jest.fn(),
}

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

describe('Article comment voting', () => {
  test('User votes for comment', () => {
    const wrapper = mount(ArticleComment, mountOptions)
    const button = wrapper.find('[data-jest-id=upvote_button]')
    button.trigger('click')
    expect(actions.voteComment).toHaveBeenCalled()
  })
})
