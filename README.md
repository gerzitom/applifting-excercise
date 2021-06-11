# applifting-axcercise

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# API problems
While building this app, I have encoutered some bugs with the API.

1) API key and tenantId is only available when creating the user (tenant) but not, when user tries to log into app.
This means, for the app to work properly, login form must be filled with user creadentials as well as API key to work properly.
I solved it with local storage, that every user can link its username with api key. This data is stored in local storage and can be choosen during login.
Proper solution (In my opinion will be: adding api key or tenant Id in response to login)

2)  Articles from API are not retrieved by createdDate in descending order. This makes lazy loading of other articles buggy and not working properly. (I implemented lazy loading just to prove, I can do it :)). 

## Global events
It there is global event, you could emit global nux event, message must have title and message and could have error object as well:
```js
this.$nuxt.$emit('error', {
    title: 'Connection error',
    message: 'Could not upvote comment, please ty it later',
    err,
})
```

My tenant ID is: 23a10b02-7fcd-460a-995f-936e95edadea


Admin id: d4a5d51b-2c1f-4768-8faa-3b2e2b13da95

Admin API key: 0e44cc0e-4d90-40c2-a059-0e25e8effbe1
