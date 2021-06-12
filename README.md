# API problems
While building this app, I have encoutered some bugs with the API.

1) API key and tenantId is only available when creating the user (tenant) but not, when user tries to log into app.
This means, for the app to work properly, login form must be filled with user creadentials as well as API key to work properly.
I solved it with local storage, that every user can link its username with api key. This data is stored in local storage and can be choosen during login.
Proper solution (In my opinion will be: adding api key or tenant Id in response to login)

2) Articles from API are not retrieved by createdDate in descending order. This makes lazy loading of other articles buggy and not working properly. (I implemented lazy loading just to prove, I can do it :)). 

3) Can not get all articles of all tenants, endpoint for getting all articles require api key and displays only articles of current tenant.
Possible solution: create another endpoint for getting all articles without api key.

4) Weird time zone. I do not know, if I have bad settings, but, I had to set specific time zone.
# Global events
It there is global event, you could emit global nux event, message must have title and message and could have error object as well. App will display snackbar at the bottom of the screen with error info.
There are 3 types of this events:
### error
Main serious error. Snackbar has red color and no delay of closing. 
```js
this.$nuxt.$emit('error', {
    title: 'Connection error',
    message: 'Could not upvote comment, please ty it later',
    err,
})
```
### Temporary error
Same as error, but message will dissapear after 4 seconds.
```js
this.$nuxt.$emit('temporary-error', {
    title: 'Connection error',
    message: 'Could not upvote comment, please ty it later',
    err,
})
```
### Info
Display info snackbar for 4 seconds
```js
this.$nuxt.$emit('info', {
    title: 'Connection error',
    message: 'Could not upvote comment, please ty it later',
    err,
})
```

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

# Test user
```json
{
    "apiKey": "73988432-8a7d-4558-bb59-d27d4fabf2c6",
    "username": "gerzitom"
}
```
